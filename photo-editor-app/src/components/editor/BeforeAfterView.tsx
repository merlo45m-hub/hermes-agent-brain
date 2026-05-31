import React, { useCallback } from "react";
import { View, Text, StyleSheet, useWindowDimensions, PanResponder } from "react-native";
import { useEditStore } from "@/stores/editStore";

interface Props {
  uri: string;
  splitPosition: number;
}

export function BeforeAfterView({ uri, splitPosition }: Props) {
  const setSplitPosition = useEditStore((s) => s.setSplitPosition);
  const { width } = useWindowDimensions();

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt) => {
        setSplitPosition(evt.nativeEvent.locationX / width);
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Before (left half) */}
      <View style={[styles.half, { width: splitPosition * width }]}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.label}>Original</Text>
        </View>
      </View>

      {/* After (right half) */}
      <View style={[styles.half, { flex: 1 }]}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.label}>Edited</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { left: splitPosition * width - 1 }]}>
        <View style={styles.dividerHandle}>
          <Text style={styles.dividerIcon}>◀▶</Text>
        </View>
      </View>

      {/* Labels */}
      <View style={styles.labelOverlay}>
        <Text style={styles.labelText}>BEFORE</Text>
        <Text style={styles.labelText}>AFTER</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    position: "relative",
  },
  half: {
    height: "100%",
    overflow: "hidden",
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#999",
    fontSize: 14,
  },
  divider: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "#4A9EFF",
    justifyContent: "center",
    alignItems: "center",
  },
  dividerHandle: {
    width: 24,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#4A9EFF",
    justifyContent: "center",
    alignItems: "center",
  },
  dividerIcon: {
    color: "#fff",
    fontSize: 10,
  },
  labelOverlay: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  labelText: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    letterSpacing: 1,
  },
});
