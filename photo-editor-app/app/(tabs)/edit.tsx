import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Sun,
  Crop,
  Sliders,
  Palette,
  Wand2,
  RotateCcw,
  RotateCw,
  Columns,
  Download,
  ChevronUp,
  Layers,
  Sparkles,
} from "lucide-react-native";
import { useEditStore } from "@/stores/editStore";
import { usePhotoStore } from "@/stores/photoStore";
import type { EditTool } from "@/stores/editStore";
import { AdjustmentPanel } from "@/components/editor/AdjustmentPanel";
import { CurveEditor } from "@/components/editor/CurveEditor";
import { HistogramView } from "@/components/editor/HistogramView";
import { CropTool } from "@/components/editor/CropTool";
import { FilterList } from "@/components/editor/FilterList";
import { LayersPanel } from "@/components/editor/LayersPanel";
import { BeforeAfterView } from "@/components/editor/BeforeAfterView";
import { AIPanel } from "@/components/editor/AIPanel";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const COLORS = {
  bg: "#0a0a0a",
  surface: "#121212",
  surface2: "#1a1a1a",
  text: "#f0f0f0",
  textSecondary: "#999",
  accent: "#4A9EFF",
  border: "#222",
  toolbarBg: "#0d0d0d",
};

const TOOLS: { tool: EditTool; icon: React.ReactNode; label: string }[] = [
  { tool: "crop", icon: <Crop size={20} />, label: "Crop" },
  { tool: "adjust", icon: <Sliders size={20} />, label: "Adjust" },
  { tool: "curve", icon: <Palette size={20} />, label: "Curve" },
  { tool: "filter", icon: <Wand2 size={20} />, label: "Filters" },
  { tool: "retouch", icon: <Sparkles size={20} />, label: "Retouch" },
];

export default function EditScreen() {
  const store = useEditStore();
  const photoStore = usePhotoStore();

  const activePhoto = photoStore.photos[0]; // simplified: pick first photo

  const handleLoadDemo = useCallback(() => {
    if (store.activePhotoUri) {
      store.closePhoto();
    } else {
      store.loadPhoto("demo://edit-photo", 4000, 3000);
    }
  }, [store]);

  if (!store.activePhotoUri) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.emptyState}>
          <Sun size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>No photo loaded</Text>
          <Text style={styles.emptySubtitle}>
            Select a photo from the Library to start editing
          </Text>
          <TouchableOpacity style={styles.loadBtn} onPress={handleLoadDemo}>
            <Text style={styles.loadBtnText}>Load Demo Photo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={store.closePhoto}>
          <ArrowLeft size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Edit</Text>
        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.topBtn}
            onPress={store.toggleBeforeAfter}
          >
            <Columns size={20} color={store.showBeforeAfter ? COLORS.accent : COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBtn} onPress={store.undo}>
            <RotateCcw size={20} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBtn} onPress={store.redo}>
            <RotateCw size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Canvas area ── */}
      <View style={styles.canvas}>
        {store.showBeforeAfter ? (
          <BeforeAfterView uri={store.activePhotoUri} splitPosition={store.splitPosition} />
        ) : (
          <View style={styles.canvasPlaceholder}>
            <Text style={styles.canvasLabel}>{store.originalWidth}×{store.originalHeight}</Text>
          </View>
        )}

        {/* Histogram overlay */}
        <View style={styles.histogramOverlay}>
          <HistogramView />
        </View>
      </View>

      {/* ── Tool panel (bottom sheet) ── */}
      <View style={styles.toolPanel}>
        {/* Active tool content */}
        {store.activeTool !== "none" && (
          <View style={styles.toolContent}>
            {store.activeTool === "adjust" && <AdjustmentPanel />}
            {store.activeTool === "curve" && <CurveEditor />}
            {store.activeTool === "crop" && <CropTool />}
            {store.activeTool === "filter" && <FilterList />}
            {store.activeTool === "retouch" && <AIPanel />}
          </View>
        )}

        {/* Layer indicator */}
        {store.activeTool === "none" && store.layers.length > 0 && (
          <TouchableOpacity style={styles.layersHint}>
            <Layers size={16} color={COLORS.textSecondary} />
            <Text style={styles.layersHintText}>
              {store.layers.length} layer{store.layers.length > 1 ? "s" : ""}
            </Text>
            <ChevronUp size={14} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}

        {/* Bottom toolbar */}
        <View style={styles.toolbar}>
          {TOOLS.map(({ tool, icon, label }) => (
            <TouchableOpacity
              key={tool}
              style={[
                styles.toolbarItem,
                store.activeTool === tool && styles.toolbarItemActive,
              ]}
              onPress={() => store.setActiveTool(tool)}
            >
              <View style={styles.toolIcon}>
                {React.cloneElement(icon as React.ReactElement, {
                  color: store.activeTool === tool ? COLORS.accent : COLORS.textSecondary,
                })}
              </View>
              <Text
                style={[
                  styles.toolLabel,
                  store.activeTool === tool && styles.toolLabelActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  loadBtn: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
  },
  loadBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  topTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  topActions: {
    flexDirection: "row",
    gap: 4,
  },
  topBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  canvas: {
    flex: 1,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  canvasPlaceholder: {
    flex: 1,
    width: "100%",
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  canvasLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  histogramOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 120,
    height: 60,
  },
  toolPanel: {
    backgroundColor: COLORS.toolbarBg,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
  },
  toolContent: {
    maxHeight: 280,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  layersHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 6,
  },
  layersHintText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  toolbarItem: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 60,
  },
  toolbarItemActive: {
    backgroundColor: "rgba(74, 158, 255, 0.1)",
  },
  toolIcon: {
    marginBottom: 3,
  },
  toolLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  toolLabelActive: {
    color: COLORS.accent,
  },
});
