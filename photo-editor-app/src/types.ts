// ─── Adjustment parameters ────────────────────────────────────────────────
export interface AdjustmentParams {
  exposure: number; // -100..100
  contrast: number;
  highlights: number;
  shadows: number;
  saturation: number;
  vibrance: number;
  temperature: number; // Kelvin offset
  tint: number; // green-magenta
  sharpness: number;
  noiseReduction: number;
}

export const DEFAULT_ADJUSTMENTS: AdjustmentParams = {
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

// ─── Tone curve ────────────────────────────────────────────────────────────
export interface CurvePoint {
  x: number; // 0..1
  y: number; // 0..1
}

export type CurveChannel = "rgb" | "r" | "g" | "b";

export interface ToneCurve {
  rgb: CurvePoint[];
  r: CurvePoint[];
  g: CurvePoint[];
  b: CurvePoint[];
}

export const DEFAULT_CURVE: ToneCurve = {
  rgb: [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ],
  r: [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ],
  g: [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ],
  b: [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ],
};

// ─── Crop & Transform ──────────────────────────────────────────────────────
export interface AspectRatio {
  label: string;
  ratio: number; // w/h
}

export const ASPECT_RATIOS: AspectRatio[] = [
  { label: "Free", ratio: 0 },
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "3:2", ratio: 3 / 2 },
  { label: "16:9", ratio: 16 / 9 },
  { label: "3:4", ratio: 3 / 4 },
  { label: "2:3", ratio: 2 / 3 },
  { label: "9:16", ratio: 9 / 16 },
];

export interface CropTransform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees
  aspectRatio: number;
  perspectiveTL: { x: number; y: number };
  perspectiveTR: { x: number; y: number };
  perspectiveBL: { x: number; y: number };
  perspectiveBR: { x: number; y: number };
}

export const DEFAULT_CROP: CropTransform = {
  x: 0,
  y: 0,
  width: 1,
  height: 1,
  rotation: 0,
  aspectRatio: 0,
  perspectiveTL: { x: 0, y: 0 },
  perspectiveTR: { x: 1, y: 0 },
  perspectiveBL: { x: 0, y: 1 },
  perspectiveBR: { x: 1, y: 1 },
};

// ─── Filters / Presets ─────────────────────────────────────────────────────
export interface FilterPreset {
  id: string;
  name: string;
  adjustments: Partial<AdjustmentParams>;
  curve?: Partial<ToneCurve>;
  colorOverlay?: string; // hex
  intensity: number; // 0..1
}

// ─── Histogram ─────────────────────────────────────────────────────────────
export interface HistogramData {
  r: number[]; // 256 buckets
  g: number[];
  b: number[];
  luminance: number[];
}

// ─── Layers ────────────────────────────────────────────────────────────────
export type LayerType =
  | "adjustment"
  | "filter"
  | "crop"
  | "ai_adjustment"
  | "mask";

export interface Layer {
  id: string;
  type: LayerType;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  adjustments: AdjustmentParams;
  curve?: ToneCurve;
  crop?: CropTransform;
  mask?: number[]; // 0..1 alpha values
}

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "soft_light"
  | "hard_light"
  | "color"
  | "luminosity";

// ─── Photo ─────────────────────────────────────────────────────────────────
export type PhotoRating = 0 | 1 | 2 | 3 | 4 | 5;
export type ColorLabel = "none" | "red" | "yellow" | "green" | "blue" | "purple";
export type PhotoFlag = "none" | "pick" | "reject";

export interface Photo {
  id: string;
  uri: string;
  filename: string;
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  modifiedAt: string;
  rating: PhotoRating;
  label: ColorLabel;
  flag: PhotoFlag;
  albumIds: string[];
  tags: string[];
  exif: Record<string, string>;
}

export interface Album {
  id: string;
  name: string;
  coverPhotoId: string | null;
  photoCount: number;
  createdAt: string;
}

// ─── AI ────────────────────────────────────────────────────────────────────
export type AIFeature =
  | "autoEnhance"
  | "backgroundRemoval"
  | "objectRemoval"
  | "styleTransfer"
  | "portraitRetouch"
  | "smartCategorization";

export interface AIProcessor<TInput = unknown, TOutput = unknown> {
  id: AIFeature;
  name: string;
  isAvailable(): Promise<boolean>;
  process(input: TInput): Promise<TOutput>;
  modelSize: number; // bytes
  runsOnDevice: boolean;
}

export type AIFeatureFlag = {
  [K in AIFeature]: boolean;
};

// ─── Export ────────────────────────────────────────────────────────────────
export type ExportFormat = "jpeg" | "png" | "tiff";

export interface ExportSettings {
  format: ExportFormat;
  quality: number; // 1..100
  width: number;
  height: number;
  preserveMetadata: boolean;
  watermark: Watermark | null;
}

export interface Watermark {
  type: "text" | "image";
  text?: string;
  imageUri?: string;
  position: "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";
  opacity: number; // 0..1
  scale: number; // % of image width
}
