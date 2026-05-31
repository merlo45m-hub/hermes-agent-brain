import type { AIFeature, AIProcessor } from "@/types";

/**
 * Unified registry for all AI processors.
 *
 * Phase 1: Register stubs that return isAvailable() === false.
 * Phase 2: Replace stubs with real ONNX / API implementations.
 */

class AIServiceRegistry {
  private processors = new Map<AIFeature, AIProcessor>();

  register(processor: AIProcessor): void {
    if (this.processors.has(processor.id)) {
      console.warn(`[AI] Processor "${processor.id}" already registered, replacing.`);
    }
    this.processors.set(processor.id, processor);
  }

  unregister(feature: AIFeature): void {
    this.processors.delete(feature);
  }

  get(feature: AIFeature): AIProcessor | undefined {
    return this.processors.get(feature);
  }

  list(): AIProcessor[] {
    return Array.from(this.processors.values());
  }

  async isAvailable(feature: AIFeature): Promise<boolean> {
    const processor = this.processors.get(feature);
    if (!processor) return false;
    return processor.isAvailable();
  }

  async process<TInput, TOutput>(
    feature: AIFeature,
    input: TInput
  ): Promise<TOutput> {
    const processor = this.processors.get(feature);
    if (!processor) {
      throw new Error(`[AI] No processor registered for "${feature}"`);
    }
    const available = await processor.isAvailable();
    if (!available) {
      throw new Error(`[AI] Processor "${feature}" is not available`);
    }
    return processor.process(input) as Promise<TOutput>;
  }
}

export const aiRegistry = new AIServiceRegistry();
