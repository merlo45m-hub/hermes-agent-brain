import { create } from "zustand";
import type {
  AdjustmentParams,
  ToneCurve,
  CropTransform,
  HistogramData,
  Layer,
  FilterPreset,
  BlendMode,
  AspectRatio,
} from "@/types";
import {
  DEFAULT_ADJUSTMENTS,
  DEFAULT_CURVE,
  DEFAULT_CROP,
} from "@/types";

interface EditState {
  // Active photo
  activePhotoUri: string | null;
  originalWidth: number;
  originalHeight: number;

  // Layer system
  layers: Layer[];
  activeLayerId: string | null;
  history: Layer[][];
  historyIndex: number;
  maxHistory: number;

  // Current tool
  activeTool: EditTool;

  // Preview
  showBeforeAfter: boolean;
  splitPosition: number; // 0..1

  // Adjustments
  adjustments: AdjustmentParams;
  curve: ToneCurve;
  crop: CropTransform;

  // Histogram
  histogram: HistogramData | null;

  // Filters
  presets: FilterPreset[];
  activePresetId: string | null;

  // Actions
  loadPhoto: (uri: string, width: number, height: number) => void;
  closePhoto: () => void;

  // Layer actions
  addLayer: (type: Layer["type"]) => string;
  removeLayer: (id: string) => void;
  setLayerVisibility: (id: string, visible: boolean) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  setLayerBlendMode: (id: string, blendMode: BlendMode) => void;
  setActiveLayer: (id: string) => void;
  reorderLayer: (fromIndex: number, toIndex: number) => void;

  // Adjustment actions
  setAdjustment: <K extends keyof AdjustmentParams>(
    key: K,
    value: AdjustmentParams[K]
  ) => void;
  resetAdjustments: () => void;

  // Curve
  setCurve: (curve: ToneCurve) => void;
  setCurvePoints: (channel: keyof ToneCurve, points: { x: number; y: number }[]) => void;

  // Crop
  setCrop: (crop: Partial<CropTransform>) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  resetCrop: () => void;

  // Tool
  setActiveTool: (tool: EditTool) => void;

  // Before/After
  toggleBeforeAfter: () => void;
  setSplitPosition: (pos: number) => void;

  // Presets
  addPreset: (preset: FilterPreset) => void;
  applyPreset: (presetId: string) => void;
  removePreset: (id: string) => void;
  exportPresets: () => FilterPreset[];
  importPresets: (presets: FilterPreset[]) => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;

  // Histogram
  setHistogram: (histogram: HistogramData) => void;
}

export type EditTool =
  | "none"
  | "crop"
  | "adjust"
  | "curve"
  | "filter"
  | "retouch";

function snapshotLayers(state: EditState): Layer[] {
  return JSON.parse(JSON.stringify(state.layers));
}

let _layerCounter = 0;

export const useEditStore = create<EditState>((set, get) => ({
  activePhotoUri: null,
  originalWidth: 0,
  originalHeight: 0,
  layers: [],
  activeLayerId: null,
  history: [],
  historyIndex: -1,
  maxHistory: 50,
  activeTool: "none",
  showBeforeAfter: false,
  splitPosition: 0.5,
  adjustments: { ...DEFAULT_ADJUSTMENTS },
  curve: JSON.parse(JSON.stringify(DEFAULT_CURVE)),
  crop: { ...DEFAULT_CROP },
  histogram: null,
  presets: [],
  activePresetId: null,

  loadPhoto: (uri, width, height) => {
    const baseLayerId = `layer_${_layerCounter++}`;
    const baseLayer: Layer = {
      id: baseLayerId,
      type: "adjustment",
      name: "Base",
      visible: true,
      opacity: 1,
      blendMode: "normal",
      adjustments: { ...DEFAULT_ADJUSTMENTS },
    };
    set({
      activePhotoUri: uri,
      originalWidth: width,
      originalHeight: height,
      layers: [baseLayer],
      activeLayerId: baseLayerId,
      history: [[baseLayer]],
      historyIndex: 0,
    });
  },

  closePhoto: () => {
    set({
      activePhotoUri: null,
      layers: [],
      activeLayerId: null,
      history: [],
      historyIndex: -1,
    });
  },

  addLayer: (type) => {
    const id = `layer_${_layerCounter++}`;
    const layer: Layer = {
      id,
      type,
      name: type === "adjustment" ? "Adjustment" : type === "filter" ? "Filter" : type === "ai_adjustment" ? "AI" : "Mask",
      visible: true,
      opacity: 1,
      blendMode: "normal",
      adjustments: { ...DEFAULT_ADJUSTMENTS },
    };
    set((s) => {
      const layers = [...s.layers, layer];
      const history = s.history.slice(0, s.historyIndex + 1);
      history.push(JSON.parse(JSON.stringify(layers)));
      return {
        layers,
        activeLayerId: id,
        history: history.slice(-s.maxHistory),
        historyIndex: history.length - 1,
      };
    });
    return id;
  },

  removeLayer: (id) => {
    set((s) => {
      if (s.layers.length <= 1) return s; // keep base layer
      const layers = s.layers.filter((l) => l.id !== id);
      const history = s.history.slice(0, s.historyIndex + 1);
      history.push(JSON.parse(JSON.stringify(layers)));
      return {
        layers,
        activeLayerId: s.activeLayerId === id ? layers[0].id : s.activeLayerId,
        history: history.slice(-s.maxHistory),
        historyIndex: history.length - 1,
      };
    });
  },

  setLayerVisibility: (id, visible) => {
    set((s) => ({
      layers: s.layers.map((l) => (l.id === id ? { ...l, visible } : l)),
    }));
  },

  setLayerOpacity: (id, opacity) => {
    set((s) => ({
      layers: s.layers.map((l) => (l.id === id ? { ...l, opacity } : l)),
    }));
  },

  setLayerBlendMode: (id, blendMode) => {
    set((s) => ({
      layers: s.layers.map((l) => (l.id === id ? { ...l, blendMode } : l)),
    }));
  },

  setActiveLayer: (id) => set({ activeLayerId: id }),

  reorderLayer: (fromIndex, toIndex) => {
    set((s) => {
      const layers = [...s.layers];
      const [moved] = layers.splice(fromIndex, 1);
      layers.splice(toIndex, 0, moved);
      return { layers };
    });
  },

  setAdjustment: (key, value) => {
    set((s) => {
      const adjustments = { ...s.adjustments, [key]: value };
      const layers = s.activeLayerId
        ? s.layers.map((l) =>
            l.id === s.activeLayerId ? { ...l, adjustments } : l
          )
        : s.layers;
      return { adjustments, layers };
    });
  },

  resetAdjustments: () => {
    set((s) => ({
      adjustments: { ...DEFAULT_ADJUSTMENTS },
      layers: s.layers.map((l) => ({ ...l, adjustments: { ...DEFAULT_ADJUSTMENTS } })),
    }));
  },

  setCurve: (curve) => set({ curve }),
  setCurvePoints: (channel, points) => {
    set((s) => {
      const curve = { ...s.curve, [channel]: points };
      return { curve };
    });
  },

  setCrop: (crop) => set((s) => ({ crop: { ...s.crop, ...crop } })),
  setAspectRatio: (ratio) =>
    set((s) => ({ crop: { ...s.crop, aspectRatio: ratio.ratio } })),
  resetCrop: () => set({ crop: { ...DEFAULT_CROP } }),

  setActiveTool: (tool) =>
    set((s) => ({
      activeTool: s.activeTool === tool ? "none" : tool,
    })),

  toggleBeforeAfter: () =>
    set((s) => ({ showBeforeAfter: !s.showBeforeAfter })),

  setSplitPosition: (pos) => set({ splitPosition: Math.max(0, Math.min(1, pos)) }),

  addPreset: (preset) =>
    set((s) => ({ presets: [...s.presets, preset] })),

  applyPreset: (presetId) => {
    const state = get();
    const preset = state.presets.find((p) => p.id === presetId);
    if (!preset) return;
    set((s) => ({
      adjustments: { ...s.adjustments, ...preset.adjustments },
      curve: preset.curve
        ? { ...s.curve, ...preset.curve }
        : s.curve,
      activePresetId: presetId,
    }));
  },

  removePreset: (id) =>
    set((s) => ({ presets: s.presets.filter((p) => p.id !== id) })),

  exportPresets: () => get().presets,
  importPresets: (presets) =>
    set((s) => ({ presets: [...s.presets, ...presets] })),

  undo: () => {
    set((s) => {
      if (s.historyIndex <= 0) return s;
      const newIndex = s.historyIndex - 1;
      return {
        layers: JSON.parse(JSON.stringify(s.history[newIndex])),
        historyIndex: newIndex,
      };
    });
  },

  redo: () => {
    set((s) => {
      if (s.historyIndex >= s.history.length - 1) return s;
      const newIndex = s.historyIndex + 1;
      return {
        layers: JSON.parse(JSON.stringify(s.history[newIndex])),
        historyIndex: newIndex,
      };
    });
  },

  setHistogram: (histogram) => set({ histogram }),
}));
