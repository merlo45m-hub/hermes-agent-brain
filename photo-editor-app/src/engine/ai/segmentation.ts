// ──── segmentation.ts ────
import type { AIProcessor } from "@/types";
/**
 * Smart Background Removal — ONNX segmentation model (~5MB).
 * One-tap isolate subject from background.
 */
export const segmentationProcessor: AIProcessor<{ pixels: Uint8ClampedArray; width: number; height: number }, { mask: Uint8ClampedArray; foreground: Uint8ClampedArray }> = {
  id: "backgroundRemoval", name: "Background Removal", modelSize: 5_000_000, runsOnDevice: true,
  isAvailable: async () => false,
  async process(input) { throw new Error("[backgroundRemoval] Not implemented (Phase 2)"); },
};
