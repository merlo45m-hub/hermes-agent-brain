import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Eye, EyeOff, Trash2, GripVertical } from "lucide-react-native";
import { useEditStore } from "@/stores/editStore";
import type { Layer } from "@/types";

const COLORS = {
  text: "#f0f0f0",
  textSecondary: "#999",
  accent: "#4A9EFF",
  surface: "#121212",
  surface2: "#1a1a1a",
  border: "#222",
  danger: "#F44336",
};

export function LayersPanel() {
  const layers = useEditStore((s) => s.layers);
  const activeLayerId = useEditStore((s) => s.activeLayerId);
  const setActiveLayer = useEditStore((s) => s.setActiveLayer);
  const setLayerVisibility = useEditStore((s) => s.setLayerVisibility);
  const removeLayer = useEditStore((s) => s.removeLayer);

  if (layers.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Layers</Text>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {[...layers].reverse().map((layer) => {
          const isActive = layer.id === activeLayerId;
          return (
            <TouchableOpacity
              key={layer.id}
              style={[styles.layerRow, isActive && styles.layerRowActive]}
              onPress={() => setActiveLayer(layer.id)}
            >
              <GripVertical size={14} color={COLORS.textSecondary} />
              <View style={styles.layerInfo}>
                <Text style={[styles.layerName, isActive && styles.layerNameActive]}>
                  {layer.name}
                </Text>
                <Text style={styles.layerType}>{layer.type}</Text>
              </View>
              <View style={styles.layerActions}>
                <TouchableOpacity
                  onPress={() => setLayerVisibility(layer.id, !layer.visible)}
                >
                  {layer.visible ? (
                    <Eye size={16} color={COLORS.textSecondary} />
                  ) : (
                    <EyeOff size={16} color={COLORS.textSecondary} />
                  )}
                </TouchableOpacity>
                {layers.length > 1 && (
                  <TouchableOpacity onPress={() => removeLayer(layer.id)}>
                    <Trash2 size={16} color={COLORS.danger} />
                  </TouchableOpacity>
                )}
              </View>
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
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  list: {
    maxHeight: 200,
  },
  layerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 10,
    marginBottom: 4,
    gap: 8,
  },
  layerRowActive: {
    backgroundColor: "rgba(74, 158, 255, 0.05)",
    borderWidth: 0.5,
    borderColor: COLORS.accent,
  },
  layerInfo: {
    flex: 1,
  },
  layerName: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  layerNameActive: {
    color: COLORS.accent,
  },
  layerType: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textTransform: "capitalize",
  },
  layerActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
});
