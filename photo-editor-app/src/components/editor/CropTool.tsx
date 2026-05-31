import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEditStore } from "@/stores/editStore";
import { ASPECT_RATIOS, type AspectRatio } from "@/types";

const COLORS = {
  text: "#f0f0f0",
  textSecondary: "#999",
  accent: "#4A9EFF",
  surface2: "#1a1a1a",
  border: "#222",
};

export function CropTool() {
  const crop = useEditStore((s) => s.crop);
  const setAspectRatio = useEditStore((s) => s.setAspectRatio);
  const resetCrop = useEditStore((s) => s.resetCrop);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Crop & Rotate</Text>
        <TouchableOpacity onPress={resetCrop}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Rotation control */}
      <View style={styles.row}>
        <Text style={styles.label}>Rotation</Text>
        <View style={styles.rotationRow}>
          <TouchableOpacity style={styles.rotateBtn}>
            <Text style={styles.rotateBtnText}>↺</Text>
          </TouchableOpacity>
          <Text style={styles.rotationValue}>{crop.rotation}°</Text>
          <TouchableOpacity style={styles.rotateBtn}>
            <Text style={styles.rotateBtnText}>↻</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Aspect ratios */}
      <Text style={styles.label}>Aspect Ratio</Text>
      <View style={styles.aspectRow}>
        {ASPECT_RATIOS.map((ar) => (
          <TouchableOpacity
            key={ar.label}
            style={[
              styles.aspectChip,
              crop.aspectRatio === ar.ratio && styles.aspectChipActive,
            ]}
            onPress={() => setAspectRatio(ar)}
          >
            <Text
              style={[
                styles.aspectText,
                crop.aspectRatio === ar.ratio && styles.aspectTextActive,
              ]}
            >
              {ar.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  resetText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: "600",
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginBottom: 8,
  },
  rotationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rotateBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface2,
    justifyContent: "center",
    alignItems: "center",
  },
  rotateBtnText: {
    color: COLORS.text,
    fontSize: 16,
  },
  rotationValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    minWidth: 50,
    textAlign: "center",
  },
  aspectRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  aspectChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  aspectChipActive: {
    borderColor: COLORS.accent,
    backgroundColor: "rgba(74, 158, 255, 0.1)",
  },
  aspectText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  aspectTextActive: {
    color: COLORS.accent,
  },
});
