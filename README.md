# PhotoEditor Pro

AI-powered mobile photo editing app — React Native + Expo (Phase 1) + Interactive HTML demo.

## 🚀 Quick Start

### Web Demo (No Install)
Open directly in your browser:
- **Premium UI**: https://htmlpreview.github.io/?https://github.com/merlo45m-hub/hermes-agent-brain/blob/main/photoeditor-premium.html
- **Full Demo**: https://htmlpreview.github.io/?https://github.com/merlo45m-hub/hermes-agent-brain/blob/main/photoeditor-demo.html

### Mobile App (Expo)

```bash
git clone https://github.com/merlo45m-hub/hermes-agent-brain.git
cd hermes-agent-brain/photo-editor-app
npm install
npx expo start --tunnel
```

Scan the QR code with **Expo Go** (iOS/Android).

---

## ✨ Features

### Phase 1 (Complete)
- **Library** — Grid view, ratings, color labels, pick/reject flags, multi-select
- **Edit** — 10 adjustments (exposure, contrast, saturation, temperature, etc.), tone curves, histogram, crop (8 aspect ratios), 8 filter presets, before/after split-view, layer system, undo/redo (50 steps)
- **Export** — JPEG/PNG/TIFF, quality slider, EXIF metadata, watermark (text/image)

### Phase 2 (Scaffolded - Ready for Development)
- ✨ **AI Auto-Enhance** — One-tap ML exposure & white balance
- ✂️ **Background Removal** — Isolate subject (ONNX on-device, ~5MB)
- 🖌️ **Object Removal** — AI inpainting (OpenRouter/Replicate API)
- 🎨 **Style Transfer** — Apply artistic looks
- 😊 **Face Retouching** — Skin smoothing, eye brightening, teeth whitening
- 🏷️ **Smart Categorization** — Auto-tag photos by type

---

## 📁 Project Structure

```
photo-editor-app/
├── app/                    # Expo Router navigation (tabs + modals)
│   ├── (tabs)/
│   │   ├── library.tsx    # Photo grid, import, library management
│   │   ├── edit.tsx       # Full editing workspace
│   │   └── export.tsx     # Format picker, quality, export
│   └── photo/[id].tsx     # Photo detail view
├── src/
│   ├── engine/
│   │   ├── ai/            # Phase 2 AI features (all stubs, ready to implement)
│   │   ├── pipeline/      # Layer stack, non-destructive editing
│   │   └── render/        # Skia-based rendering, color matrix
│   ├── stores/            # Zustand state (photo, edit, ai, export)
│   └── components/        # UI components (sliders, curves, histogram, etc.)
├── package.json           # Dependencies (Expo SDK 52, react-native-skia, zustand)
└── tsconfig.json          # TypeScript config
```

---

## 🎯 What's New vs. Competitors

| Feature | PhotoEditor Pro | Lightroom | Snapseed | Adobe Express |
|---------|---|---|---|---|
| AI Object Removal | ✓ (Phase 2) | ✓ | ✗ | ✓ |
| Custom AI Backgrounds | ✓ (Phase 2) | ✗ | ✗ | ✓ |
| Batch Processing | ✓ | ✓ | ✗ | ✓ |
| On-Device Models | ✓ (ONNX) | ✗ | ✓ | ✗ |
| Open Source | ✓ | ✗ | ✗ | ✗ |
| Free Tier | ✓ | Limited | ✓ | Limited |

---

## 🤖 AI Integration Points (Phase 2)

All Phase 2 features use a **unified AIServiceRegistry** pattern:

```typescript
// Phase 2: Enable and integrate
const processor = AIRegistry.get('autoEnhance');
if (processor.isAvailable()) {
  const result = await processor.process(imageData);
}
```

### On-Device Models (ONNX Runtime Mobile)
- Auto-Enhance (~3MB)
- Background Removal (~5MB)
- Face Retouching (~2MB)
- Smart Categorization (~4MB)

### API-First (OpenRouter / Replicate)
- Object Removal (API call with mask + context)
- Style Transfer (reference image + style prompt)

All API keys stored securely in `expo-secure-store`.

---

## 🛠️ Tech Stack

- **React Native** / **Expo SDK 52+**
- **expo-router** — File-based navigation
- **react-native-skia** — GPU-accelerated image processing
- **gl-react** — WebGL rendering
- **Zustand** — State management
- **react-native-reanimated 3** — Smooth animations
- **TypeScript** — Type safety
- **Lucide React Native** — Icon system

---

## 📊 Stats

- **4,518 lines** of TypeScript/TSX
- **32 source files**
- **~74 pages** PDF source code documentation
- **6 AI features** scaffolded and ready for Phase 2 development

---

## 🚀 Next Steps

### For Phase 2 Development:
1. Download an **ONNX model** for auto-enhance (e.g., from Hugging Face)
2. Wire up `modelLoader.ts` to download and cache the model
3. Replace the stub in `autoEnhance.ts` with real inference code
4. Flip the `features.autoEnhance` flag to `true` in `aiStore.ts`
5. Deploy via EAS Build to App Store / Play Store

### For Custom Deployment:
```bash
npx eas build --platform all
npx eas submit
```

---

## 📝 License

MIT — Free to modify and distribute.

---

## 👨‍💻 Author

Built by **Hermes Agent** for Michael (@merlo45m-hub)

**Demo Files:**
- `photoeditor-demo.html` — Full editing UI demo
- `photoeditor-premium.html` — Premium Retouch/Shadow/Batch UI
- `photo-editor-app/` — Full Expo React Native source

---

**Questions?** Open an issue or check the PDFs in this repo for full API docs.

