/**
 * ONNX model download, caching, and version management.
 *
 * Phase 1: Stub — no actual downloads happen.
 * Phase 2: Downloads ONNX .ort models, stores in expo-file-system cache,
 *          tracks versions, handles incremental updates.
 */

import { Platform } from "react-native";

export interface ModelMetadata {
  feature: string;
  filename: string;
  version: string;
  size: number; // bytes
  url: string;
  checksum: string; // SHA-256
}

export interface ModelStatus {
  downloaded: boolean;
  version: string;
  path: string | null;
  progress: number; // 0..1
}

const MODEL_REGISTRY: Record<string, ModelMetadata> = {
  autoEnhance: {
    feature: "autoEnhance",
    filename: "auto_enhance_v1.ort",
    version: "1.0.0",
    size: 3_000_000,
    url: "", // Phase 2: CDN URL
    checksum: "",
  },
  backgroundRemoval: {
    feature: "backgroundRemoval",
    filename: "segmentation_lite_v1.ort",
    version: "1.0.0",
    size: 5_000_000,
    url: "",
    checksum: "",
  },
  portraitRetouch: {
    feature: "portraitRetouch",
    filename: "face_retouch_v1.ort",
    version: "1.0.0",
    size: 2_000_000,
    url: "",
    checksum: "",
  },
  smartCategorization: {
    feature: "smartCategorization",
    filename: "photo_classifier_v1.ort",
    version: "1.0.0",
    size: 4_000_000,
    url: "",
    checksum: "",
  },
};

export async function getModelStatus(feature: string): Promise<ModelStatus> {
  // Phase 1: always return not downloaded
  return {
    downloaded: false,
    version: "",
    path: null,
    progress: 0,
  };
}

export async function downloadModel(
  feature: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Phase 2: implement actual download with expo-file-system
  // const metadata = MODEL_REGISTRY[feature];
  // const dest = `${FileSystem.cacheDirectory}models/${metadata.filename}`;
  // const resumable = FileSystem.createDownloadResumable(metadata.url, dest, {}, onProgress);
  // const result = await resumable.downloadAsync();
  // return result.uri;
  throw new Error(`[ModelLoader] Feature "${feature}" not yet available (Phase 2)`);
}

export async function verifyChecksum(path: string, expected: string): Promise<boolean> {
  // Phase 2: compute SHA-256 of file, compare with expected
  return false;
}

export async function clearModelCache(): Promise<void> {
  // Phase 2: delete all downloaded models
}

export function getModelMetadata(feature: string): ModelMetadata | undefined {
  return MODEL_REGISTRY[feature];
}

export function listModels(): ModelMetadata[] {
  return Object.values(MODEL_REGISTRY);
}
