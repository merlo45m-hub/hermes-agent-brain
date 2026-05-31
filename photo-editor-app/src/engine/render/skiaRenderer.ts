import type { Layer } from "@/types";
import { buildRenderOrder, getBlendModeSkia, mergeAdjustments } from "@/engine/pipeline/layerStack";

/**
 * Skia-based renderer for the layer stack.
 * Applies adjustments and compositing using runtime shader effects.
 *
 * In a full implementation, this would use @shopify/react-native-skia's
 * <ImageShader>, <ColorMatrix>, <Blend>, and custom <RuntimeShader> nodes
 * to apply each adjustment in order.
 *
 * For Phase 1, this module provides the adjustment compositing logic
 * that feeds into the Skia canvas. The actual Skia rendering is done
 * in the EditCanvas component using declarative Skia components.
 */

export interface RenderPass {
  layerId: string;
  opacity: number;
  blendMode: string; // Skia blend mode
  adjustments: Record<string, number>;
  visible: boolean;
}

export function buildRenderPasses(layers: Layer[]): RenderPass[] {
  const order = buildRenderOrder(layers);
  return order.map(({ layer }) => ({
    layerId: layer.id,
    opacity: layer.opacity,
    blendMode: getBlendModeSkia(layer.blendMode),
    adjustments: { ...layer.adjustments },
    visible: layer.visible,
  }));
}

/**
 * Compute the color matrix for a given set of adjustments.
 * Returns a 4x5 matrix suitable for Skia's <ColorMatrix> filter.
 *
 * Matrix layout (column-major for Skia):
 * [
 *   R' factors,  G' factors,  B' factors,  A' factors,  offsets
 *   ...
 * ]
 */
export function computeAdjustmentMatrix(adjustments: Record<string, number>): number[] {
  const {
    exposure = 0,
    contrast = 0,
    saturation = 0,
    temperature = 0,
    tint = 0,
    highlights = 0,
    shadows = 0,
  } = adjustments;

  // Base identity matrix
  const matrix = [
    1, 0, 0, 0, 0, // R
    0, 1, 0, 0, 0, // G
    0, 0, 1, 0, 0, // B
    0, 0, 0, 1, 0, // A
  ];

  // Exposure (brightness shift)
  const exp = exposure / 100;
  for (let i = 0; i < 3; i++) {
    matrix[i * 5 + 4] += exp; // offset column
  }

  // Contrast (scale around 0.5)
  const cont = 1 + contrast / 100;
  const contOff = (1 - cont) * 0.5;
  for (let i = 0; i < 3; i++) {
    matrix[i * 5 + i] *= cont;
    matrix[i * 5 + 4] += contOff;
  }

  // Saturation (standard luminance weights)
  const sat = 1 + saturation / 100;
  const lumR = 0.3086;
  const lumG = 0.6094;
  const lumB = 0.0820;
  const sr = (1 - sat) * lumR;
  const sg = (1 - sat) * lumG;
  const sb = (1 - sat) * lumB;
  const satMatrix = [
    sr + sat, sg, sb, 0, 0,
    sr, sg + sat, sb, 0, 0,
    sr, sg, sb + sat, 0, 0,
    0, 0, 0, 1, 0,
  ];
  // Multiply: this is a rough multiply — in production combine properly
  for (let r = 0; r < 3; r++) {
    const row = r * 5;
    const m0 = matrix[row];
    const m1 = matrix[row + 1];
    const m2 = matrix[row + 2];
    const sr0 = satMatrix[row];
    const sr1 = satMatrix[row + 1];
    const sr2 = satMatrix[row + 2];
    matrix[row] = m0 * sr0;
    matrix[row + 1] = m1 * sr1;
    matrix[row + 2] = m2 * sr2;
  }

  // Temperature (blue-yellow shift)
  const temp = temperature / 100;
  matrix[0 * 5 + 4] += temp * 0.1; // R offset warm
  matrix[2 * 5 + 4] -= temp * 0.1; // B offset cool

  // Tint (green-magenta shift)
  const t = tint / 100;
  matrix[1 * 5 + 4] -= t * 0.1; // G offset
  matrix[0 * 5 + 4] += t * 0.05; // R slight
  matrix[2 * 5 + 4] += t * 0.05; // B slight

  return matrix;
}

/**
 * Apply curve to a single channel value.
 */
export function applyCurveChannel(
  value: number,
  points: { x: number; y: number }[]
): number {
  if (points.length < 2) return value;

  // Find the segment
  for (let i = 0; i < points.length - 1; i++) {
    if (value <= points[i + 1].x) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const t = (value - p0.x) / (p1.x - p0.x);
      return p0.y + t * (p1.y - p0.y);
    }
  }
  return points[points.length - 1].y;
}

/**
 * Apply a tone curve to a pixel array (RGBA).
 * Works on Uint8ClampedArray in-place.
 */
export function applyToneCurve(
  pixels: Uint8ClampedArray,
  curve: { rgb: { x: number; y: number }[]; r: { x: number; y: number }[]; g: { x: number; y: number }[]; b: { x: number; y: number }[] }
): void {
  const n = pixels.length;
  for (let i = 0; i < n; i += 4) {
    const rNorm = pixels[i] / 255;
    const gNorm = pixels[i + 1] / 255;
    const bNorm = pixels[i + 2] / 255;

    // Per-channel curves
    pixels[i] = Math.round(applyCurveChannel(rNorm, curve.r) * 255);
    pixels[i + 1] = Math.round(applyCurveChannel(gNorm, curve.g) * 255);
    pixels[i + 2] = Math.round(applyCurveChannel(bNorm, curve.b) * 255);

    // RGB composite curve (applied as luminance adjustment)
    const lum = 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
    const lumAdjusted = applyCurveChannel(lum, curve.rgb);
    const scale = lum > 0 ? lumAdjusted / lum : 1;
    pixels[i] = Math.min(255, Math.round(pixels[i] * scale));
    pixels[i + 1] = Math.min(255, Math.round(pixels[i + 1] * scale));
    pixels[i + 2] = Math.min(255, Math.round(pixels[i + 2] * scale));
  }
}
