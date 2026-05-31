import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { RotateCcw } from "lucide-react-native";
import { useEditStore } from "@/stores/editStore";
import { AdjustmentSlider } from "@/components/common/AdjustmentSlider";
import type { AdjustmentParams } from "@/types";

const COLORS = {
  text: "#f0f0f0",
  textSecondary: "#999",
  accent: "#4A9EFF",
};

const ADJUSTMENTS: { key: keyof AdjustmentParams; label: string; min: number; max: number }[] = [
  { key: "exposure", label: "Exposure", min: -100, max: 100 },
  { key: "contrast", label: "Contrast", min: -100, max: 100 },
  { key: "highlights", label: "Highlights", min: -100, max: 100 },
  { key: "shadows", label: "Shadows", min: -100, max: 100 },
  { key: "saturation", label: "Saturation", min: -100, max: 100 },
  { key: "vibrance", label: "Vibrance", min: -100, max: 100 },
  { key: "temperature", label: "Temperature", min: -100, max: 100 },
  { key: "tint", label: "Tint", min: -100, max: 100 },
  { key: "sharpness", label: "Sharpness", min: 0, max: 100 },
  { key: "noiseReduction", label: "Noise Reduction", min: 0, max: 100 },
];

export function AdjustmentPanel() {
  const adjustments = useEditStore((s) => s.adjustments);
  const setAdjustment = useEditStore((s) => s.setAdjustment);
  const resetAdjustments = useEditStore((s) => s.resetAdjustments);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Adjustments</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={resetAdjustments}>
          <RotateCcw size={14} color={COLORS.textSecondary} />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {ADJUSTMENTS.map(({ key, label, min, max }) => (
          <AdjustmentSlider
            key={key}
            label={label}
            value={adjustments[key]}
            min={min}
            max={max}
            onChange={(v) => setAdjustment(key, v)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resetText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  scrollView: {
    maxHeight: 240,
  },
  scrollContent: {
    paddingBottom: 8,
  },
});
