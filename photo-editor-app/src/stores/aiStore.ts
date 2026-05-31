import { create } from "zustand";
import type { AIFeature, AIFeatureFlag, AIProcessor } from "@/types";

interface AIState {
  // Feature flags (all off in Phase 1)
  features: AIFeatureFlag;

  // Model download state
  modelDownloads: Record<AIFeature, ModelDownloadState>;

  // API keys (stored in expo-secure-store at runtime)
  openRouterKey: string | null;
  replicateKey: string | null;

  // Registered processors
  processors: Map<AIFeature, AIProcessor>;

  // Actions
  enableFeature: (feature: AIFeature) => void;
  disableFeature: (feature: AIFeature) => void;

  setModelDownloadState: (
    feature: AIFeature,
    state: Partial<ModelDownloadState>
  ) => void;

  registerProcessor: (processor: AIProcessor) => void;
  unregisterProcessor: (feature: AIFeature) => void;

  setOpenRouterKey: (key: string) => void;
  setReplicateKey: (key: string) => void;

  isFeatureAvailable: (feature: AIFeature) => boolean;
}

export interface ModelDownloadState {
  downloaded: boolean;
  version: string;
  progress: number; // 0..1
  size: number; // bytes
}

export const AI_MODEL_SIZES: Record<AIFeature, number> = {
  autoEnhance: 3_000_000, // 3MB
  backgroundRemoval: 5_000_000, // 5MB
  objectRemoval: 0, // API-only
  styleTransfer: 0, // API-only
  portraitRetouch: 2_000_000, // 2MB
  smartCategorization: 4_000_000, // 4MB
};

const defaultModelState: ModelDownloadState = {
  downloaded: false,
  version: "",
  progress: 0,
  size: 0,
};

const allFeaturesOff: AIFeatureFlag = {
  autoEnhance: false,
  backgroundRemoval: false,
  objectRemoval: false,
  styleTransfer: false,
  portraitRetouch: false,
  smartCategorization: false,
};

export const useAIStore = create<AIState>((set, get) => ({
  features: { ...allFeaturesOff },

  modelDownloads: {
    autoEnhance: { ...defaultModelState },
    backgroundRemoval: { ...defaultModelState },
    objectRemoval: { ...defaultModelState },
    styleTransfer: { ...defaultModelState },
    portraitRetouch: { ...defaultModelState },
    smartCategorization: { ...defaultModelState },
  },

  openRouterKey: null,
  replicateKey: null,
  processors: new Map(),

  enableFeature: (feature) =>
    set((s) => ({
      features: { ...s.features, [feature]: true },
    })),

  disableFeature: (feature) =>
    set((s) => ({
      features: { ...s.features, [feature]: false },
    })),

  setModelDownloadState: (feature, state) =>
    set((s) => ({
      modelDownloads: {
        ...s.modelDownloads,
        [feature]: { ...s.modelDownloads[feature], ...state },
      },
    })),

  registerProcessor: (processor) =>
    set((s) => {
      const processors = new Map(s.processors);
      processors.set(processor.id, processor);
      return { processors };
    }),

  unregisterProcessor: (feature) =>
    set((s) => {
      const processors = new Map(s.processors);
      processors.delete(feature);
      return { processors };
    }),

  setOpenRouterKey: (key) => set({ openRouterKey: key }),
  setReplicateKey: (key) => set({ replicateKey: key }),

  isFeatureAvailable: (feature) => {
    const state = get();
    return state.features[feature];
  },
}));
