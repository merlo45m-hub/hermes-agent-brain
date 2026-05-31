import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Download, Upload } from "lucide-react-native";
import { useEditStore } from "@/stores/editStore";
import type { FilterPreset } from "@/types";

const COLORS = {
  text: "#f0f0f0",
  textSecondary: "#999",
  accent: "#4A9EFF",
  surface: "#121212",
  surface2: "#1a1a1a",
  border: "#222",
};

// Built-in presets
const DEFAULT_PRESETS: FilterPreset[] = [
  {
    id: "preset_none",
    name: "None",
    adjustments: {},
    intensity: 0,
  },
  {
    id: "preset_warm",
    name: "Warm",
    adjustments: { temperature: 30, exposure: 5, saturation: 10 },
    intensity: 1,
  },
  {
    id: "preset_cool",
    name: "Cool",
    adjustments: { temperature: -30, tint: 10, exposure: -5 },
    intensity: 1,
  },
  {
    id: "preset_bw",
    name: "B&W",
    adjustments: { saturation: -100, contrast: 20 },
    intensity: 1,
  },
  {
    id: "preset_vibrant",
    name: "Vibrant",
    adjustments: { vibrance: 40, saturation: 20, contrast: 15 },
    intensity: 1,
  },
  {
    id: "preset_fade",
    name: "Fade",
    adjustments: { contrast: -30, shadows: 20, exposure: 10 },
    intensity: 1,
  },
  {
    id: "preset_cinematic",
    name: "Cinematic",
    adjustments: { contrast: 25, shadows: -15, temperature: -10, saturation: -10 },
    intensity: 1,
  },
  {
    id: "preset_bright",
    name: "Bright",
    adjustments: { exposure: 30, highlights: 20, shadows: 10 },
    intensity: 1,
  },
];

export function FilterList() {
  const activePresetId = useEditStore((s) => s.activePresetId);
  const applyPreset = useEditStore((s) => s.applyPreset);
  const resetAdjustments = useEditStore((s) => s.resetAdjustments);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Upload size={14} color={COLORS.textSecondary} />
            <Text style={styles.actionText}>Import</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Download size={14} color={COLORS.textSecondary} />
            <Text style={styles.actionText}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.list}>
        {DEFAULT_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <TouchableOpacity
              key={preset.id}
              style={[styles.presetCard, isActive && styles.presetCardActive]}
              onPress={() => {
                if (preset.id === "preset_none") {
                  resetAdjustments();
                } else {
                  applyPreset(preset.id);
                }
              }}
            >
              <View style={styles.presetPreview}>
                <Text style={styles.presetPreviewText}>🖼️</Text>
              </View>
              <Text style={[styles.presetName, isActive && styles.presetNameActive]}>
                {preset.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  list: {
    marginBottom: 6,
  },
  presetCard: {
    marginRight: 10,
    alignItems: "center",
    width: 72,
  },
  presetCardActive: {},
  presetPreview: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  presetPreviewText: {
    fontSize: 24,
  },
  presetName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: "center",
    fontWeight: "500",
  },
  presetNameActive: {
    color: COLORS.accent,
  },
});
