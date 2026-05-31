import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Download,
  FileImage,
  FileText,
  Settings,
  Check,
  Eye,
  EyeOff,
  Type,
  Image as ImageIcon,
} from "lucide-react-native";
import { useExportStore } from "@/stores/exportStore";
import type { ExportFormat, Watermark } from "@/types";

const COLORS = {
  bg: "#0a0a0a",
  surface: "#121212",
  surface2: "#1a1a1a",
  text: "#f0f0f0",
  textSecondary: "#999",
  accent: "#4A9EFF",
  border: "#222",
  success: "#4CAF50",
};

const FORMATS: { format: ExportFormat; icon: React.ReactNode; label: string; ext: string }[] = [
  { format: "jpeg", icon: <FileImage size={24} />, label: "JPEG", ext: ".jpg" },
  { format: "png", icon: <FileImage size={24} />, label: "PNG", ext: ".png" },
  { format: "tiff", icon: <FileText size={24} />, label: "TIFF", ext: ".tiff" },
];

const WATERMARK_POSITIONS: Watermark["position"][] = [
  "top-left", "top-right", "center", "bottom-left", "bottom-right",
];

export default function ExportScreen() {
  const store = useExportStore();

  const handleExport = useCallback(async () => {
    store.setExporting(true);
    store.setExportProgress(0);
    // Simulate export progress
    for (let i = 1; i <= 10; i++) {
      await new Promise((r) => setTimeout(r, 200));
      store.setExportProgress(i / 10);
    }
    store.setLastExportPath("/storage/photos/edited_photo.jpg");
    store.setExporting(false);
  }, [store]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Export</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ── Format selection ── */}
        <Text style={styles.sectionTitle}>File Format</Text>
        <View style={styles.formatRow}>
          {FORMATS.map(({ format, icon, label, ext }) => (
            <TouchableOpacity
              key={format}
              style={[
                styles.formatCard,
                store.settings.format === format && styles.formatCardActive,
              ]}
              onPress={() => store.setFormat(format)}
            >
              {React.cloneElement(icon as React.ReactElement, {
                color: store.settings.format === format ? COLORS.accent : COLORS.textSecondary,
              })}
              <Text
                style={[
                  styles.formatLabel,
                  store.settings.format === format && styles.formatLabelActive,
                ]}
              >
                {label}
              </Text>
              <Text style={styles.formatExt}>{ext}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Quality slider ── */}
        {store.settings.format === "jpeg" && (
          <>
            <Text style={styles.sectionTitle}>Quality</Text>
            <View style={styles.qualityRow}>
              <TouchableOpacity
                style={styles.qualityBtn}
                onPress={() => store.setQuality(Math.max(1, store.settings.quality - 5))}
              >
                <Text style={styles.qualityBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.qualityBar}>
                <View
                  style={[
                    styles.qualityFill,
                    { width: `${store.settings.quality}%` },
                  ]}
                />
              </View>
              <TouchableOpacity
                style={styles.qualityBtn}
                onPress={() => store.setQuality(Math.min(100, store.settings.quality + 5))}
              >
                <Text style={styles.qualityBtnText}>+</Text>
              </TouchableOpacity>
              <Text style={styles.qualityValue}>{store.settings.quality}%</Text>
            </View>
          </>
        )}

        {/* ── Metadata toggle ── */}
        <Text style={styles.sectionTitle}>Options</Text>
        <TouchableOpacity style={styles.optionRow} onPress={store.toggleMetadata}>
          <View style={styles.optionLeft}>
            <Settings size={20} color={COLORS.textSecondary} />
            <Text style={styles.optionLabel}>Preserve EXIF Metadata</Text>
          </View>
          {store.settings.preserveMetadata ? (
            <Eye size={20} color={COLORS.accent} />
          ) : (
            <EyeOff size={20} color={COLORS.textSecondary} />
          )}
        </TouchableOpacity>

        {/* ── Watermark ── */}
        <Text style={styles.sectionTitle}>Watermark</Text>
        <View style={styles.watermarkRow}>
          <TouchableOpacity
            style={[
              styles.watermarkTypeCard,
              !store.settings.watermark && styles.watermarkCardActive,
            ]}
            onPress={() => store.setWatermark(null)}
          >
            <Text style={styles.watermarkTypeLabel}>None</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.watermarkTypeCard,
              store.settings.watermark?.type === "text" && styles.watermarkCardActive,
            ]}
            onPress={() =>
              store.setWatermark({
                type: "text",
                text: "© PhotoEditor Pro",
                position: "bottom-right",
                opacity: 0.5,
                scale: 5,
              })
            }
          >
            <Type
              size={20}
              color={
                store.settings.watermark?.type === "text"
                  ? COLORS.accent
                  : COLORS.textSecondary
              }
            />
            <Text
              style={[
                styles.watermarkTypeLabel,
                store.settings.watermark?.type === "text" && { color: COLORS.accent },
              ]}
            >
              Text
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.watermarkTypeCard,
              store.settings.watermark?.type === "image" && styles.watermarkCardActive,
            ]}
            onPress={() =>
              store.setWatermark({
                type: "image",
                imageUri: "",
                position: "center",
                opacity: 0.3,
                scale: 15,
              })
            }
          >
            <ImageIcon
              size={20}
              color={
                store.settings.watermark?.type === "image"
                  ? COLORS.accent
                  : COLORS.textSecondary
              }
            />
            <Text
              style={[
                styles.watermarkTypeLabel,
                store.settings.watermark?.type === "image" && { color: COLORS.accent },
              ]}
            >
              Image
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Export button ── */}
        <TouchableOpacity
          style={[styles.exportBtn, store.exporting && styles.exportBtnDisabled]}
          onPress={handleExport}
          disabled={store.exporting}
        >
          {store.exporting ? (
            <>
              <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
              <Text style={styles.exportBtnText}>
                Exporting... {Math.round(store.exportProgress * 100)}%
              </Text>
            </>
          ) : (
            <>
              <Download size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.exportBtnText}>
                Export as {store.settings.format.toUpperCase()}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {store.lastExportPath && (
          <View style={styles.successBanner}>
            <Check size={16} color={COLORS.success} />
            <Text style={styles.successText}>
              Saved to {store.lastExportPath}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 10,
  },
  formatRow: {
    flexDirection: "row",
    gap: 10,
  },
  formatCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  formatCardActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surface2,
  },
  formatLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  formatLabelActive: {
    color: COLORS.accent,
  },
  formatExt: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  qualityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  qualityBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface2,
    justifyContent: "center",
    alignItems: "center",
  },
  qualityBtnText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
  },
  qualityBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.surface2,
    borderRadius: 3,
    overflow: "hidden",
  },
  qualityFill: {
    height: "100%",
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  qualityValue: {
    width: 40,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  optionLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  watermarkRow: {
    flexDirection: "row",
    gap: 8,
  },
  watermarkTypeCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  watermarkCardActive: {
    borderColor: COLORS.accent,
  },
  watermarkTypeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  exportBtn: {
    marginTop: 32,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  exportBtnDisabled: {
    opacity: 0.6,
  },
  exportBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  successBanner: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 8,
    padding: 12,
  },
  successText: {
    color: COLORS.success,
    fontSize: 13,
    flex: 1,
  },
});
