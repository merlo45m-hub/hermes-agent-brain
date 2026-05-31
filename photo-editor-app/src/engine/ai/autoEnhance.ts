import type { AIProcessor } from "@/types";

/**
 * AI Auto-Enhance
 * One-tap ML exposure, white balance, contrast adjustment.
 *
 * Phase 1: Stub
 * Phase 2: ONNX Runtime Mobile model (~3MB)
 */

interface EnhanceInput {
  pixels: Uint8ClampedArray;
  width: number;
  height: number;
}

interface EnhanceOutput {
  adjustments: {
    exposure: number;
    contrast: number;
    whiteBalance: { r: number; g: number; b: number };
    shadows: number;
    highlights: number;
  };
}

export const autoEnhanceProcessor: AIProcessor<EnhanceInput, EnhanceOutput> = {
  id: "autoEnhance",
  name: "AI Auto-Enhance",
  modelSize: 3_000_000,
  runsOnDevice: true,

  isAvailable: async () => false, // Phase 2

  async process(input) {
    throw new Error("[autoEnhance] Not implemented (Phase 2)");
  },
};
