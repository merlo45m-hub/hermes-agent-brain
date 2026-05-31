import type { Layer, BlendMode } from "@/types";

/**
 * LayerStack manages the non-destructive layer pipeline.
 * Each layer stores its own adjustments, blend mode, opacity, and visibility.
 * The stack is rendered bottom-to-top by the Skia renderer.
 *
 * Phase 2: supports "ai_adjustment" layer type for ML-driven adjustments.
 */

export interface LayerRenderOrder {
  layer: Layer;
  index: number; // bottom=0
}

export function buildRenderOrder(layers: Layer[]): LayerRenderOrder[] {
  return layers
    .map((layer, index) => ({ layer, index }))
    .filter(({ layer }) => layer.visible);
}

export function getBlendModeSkia(blendMode: BlendMode): string {
  const map: Record<BlendMode, string> = {
    normal: "srcOver",
    multiply: "multiply",
    screen: "screen",
    overlay: "overlay",
    soft_light: "softLight",
    hard_light: "hardLight",
    color: "color",
    luminosity: "luminosity",
  };
  return map[blendMode] || "srcOver";
}

export function mergeAdjustments(layers: Layer[]): {
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  saturation: number;
  vibrance: number;
  temperature: number;
  tint: number;
  sharpness: number;
  noiseReduction: number;
} {
  const merged = {
    exposure: 0,
    contrast: 0,
    highlights: 0,
    shadows: 0,
    saturation: 0,
    vibrance: 0,
    temperature: 0,
    tint: 0,
    sharpness: 0,
    noiseReduction: 0,
  };

  for (const layer of layers) {
    if (!layer.visible) continue;
    const adj = layer.adjustments;
    const opacity = layer.opacity;
    merged.exposure += adj.exposure * opacity;
    merged.contrast += adj.contrast * opacity;
    merged.highlights += adj.highlights * opacity;
    merged.shadows += adj.shadows * opacity;
    merged.saturation += adj.saturation * opacity;
    merged.vibrance += adj.vibrance * opacity;
    merged.temperature += adj.temperature * opacity;
    merged.tint += adj.tint * opacity;
    merged.sharpness += adj.sharpness * opacity;
    merged.noiseReduction += adj.noiseReduction * opacity;
  }

  return merged;
}

export function computeHistogram(
  pixels: Uint8ClampedArray
): { r: number[]; g: number[]; b: number[]; luminance: number[] } {
  const r = new Array(256).fill(0);
  const g = new Array(256).fill(0);
  const b = new Array(256).fill(0);
  const luminance = new Array(256).fill(0);

  for (let i = 0; i < pixels.length; i += 4) {
    r[pixels[i]]++;
    g[pixels[i + 1]]++;
    b[pixels[i + 2]]++;
    // BT.709 luminance
    const lum = Math.round(0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2]);
    luminance[lum]++;
  }

  return { r, g, b, luminance };
}
