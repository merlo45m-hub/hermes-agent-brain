import { create } from "zustand";
import type { ExportFormat, ExportSettings, Watermark } from "@/types";

interface ExportState {
  settings: ExportSettings;
  exporting: boolean;
  exportProgress: number;
  lastExportPath: string | null;

  setFormat: (format: ExportFormat) => void;
  setQuality: (quality: number) => void;
  setDimensions: (width: number, height: number) => void;
  toggleMetadata: () => void;
  setWatermark: (watermark: Watermark | null) => void;
  reset: () => void;
  setExporting: (exporting: boolean) => void;
  setExportProgress: (progress: number) => void;
  setLastExportPath: (path: string) => void;
}

const defaultSettings: ExportSettings = {
  format: "jpeg",
  quality: 95,
  width: 0,
  height: 0,
  preserveMetadata: true,
  watermark: null,
};

export const useExportStore = create<ExportState>((set) => ({
  settings: { ...defaultSettings },
  exporting: false,
  exportProgress: 0,
  lastExportPath: null,

  setFormat: (format) =>
    set((s) => ({ settings: { ...s.settings, format } })),

  setQuality: (quality) =>
    set((s) => ({ settings: { ...s.settings, quality } })),

  setDimensions: (width, height) =>
    set((s) => ({ settings: { ...s.settings, width, height } })),

  toggleMetadata: () =>
    set((s) => ({
      settings: { ...s.settings, preserveMetadata: !s.settings.preserveMetadata },
    })),

  setWatermark: (watermark) =>
    set((s) => ({ settings: { ...s.settings, watermark } })),

  reset: () => set({ settings: { ...defaultSettings } }),

  setExporting: (exporting) => set({ exporting }),
  setExportProgress: (progress) => set({ exportProgress: progress }),
  setLastExportPath: (path) => set({ lastExportPath: path }),
}));
