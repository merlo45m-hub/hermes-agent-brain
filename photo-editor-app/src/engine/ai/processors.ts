import type { AIProcessor } from "@/types";

// ──── inpainting.ts ────
export const inpaintingProcessor: AIProcessor<
  { pixels: Uint8ClampedArray; mask: Uint8ClampedArray; width: number; height: number; prompt?: string },
  { result: Uint8ClampedArray }
> = {
  id: "objectRemoval", name: "AI Object Removal", modelSize: 0, runsOnDevice: false,
  isAvailable: async () => false,
  async process(input) { throw new Error("[objectRemoval] Not implemented (Phase 2)"); },
};

// ──── styleTransfer.ts ────
export const styleTransferProcessor: AIProcessor<
  { pixels: Uint8ClampedArray; stylePrompt: string; styleImageUri?: string; width: number; height: number },
  { result: Uint8ClampedArray }
> = {
  id: "styleTransfer", name: "Style Transfer", modelSize: 0, runsOnDevice: false,
  isAvailable: async () => false,
  async process(input) { throw new Error("[styleTransfer] Not implemented (Phase 2)"); },
};

// ──── portraitRetouch.ts ────
export const portraitRetouchProcessor: AIProcessor<
  { pixels: Uint8ClampedArray; width: number; height: number; smoothing: number; eyeBrighten: number; teethWhiten: number },
  { result: Uint8ClampedArray }
> = {
  id: "portraitRetouch", name: "Face Retouching", modelSize: 2_000_000, runsOnDevice: true,
  isAvailable: async () => false,
  async process(input) { throw new Error("[portraitRetouch] Not implemented (Phase 2)"); },
};

// ──── classifier.ts ────
export const classifierProcessor: AIProcessor<
  { pixels: Uint8ClampedArray; width: number; height: number },
  { tags: string[]; primaryCategory: string; confidence: number }
> = {
  id: "smartCategorization", name: "Smart Categorization", modelSize: 4_000_000, runsOnDevice: true,
  isAvailable: async () => false,
  async process(input) { throw new Error("[smartCategorization] Not implemented (Phase 2)"); },
};
