import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path, Line, Circle } from "react-native-svg";
import { useEditStore } from "@/stores/editStore";
import type { ToneCurve, CurveChannel } from "@/types";

const COLORS = {
  text: "#f0f0f0",
  textSecondary: "#999",
  accent: "#4A9EFF",
  surface: "#121212",
  border: "#222",
  grid: "#333",
};

const CHANNELS: { key: CurveChannel; label: string; color: string }[] = [
  { key: "rgb", label: "RGB", color: "#aaa" },
  { key: "r", label: "R", color: "#f44" },
  { key: "g", label: "G", color: "#4f4" },
  { key: "b", label: "B", color: "#44f" },
];

export function CurveEditor() {
  const curve = useEditStore((s) => s.curve);
  const setCurvePoints = useEditStore((s) => s.setCurvePoints);

  const renderChannelTab = useCallback(
    (channel: (typeof CHANNELS)[0]) => {
      const points = curve[channel.key];
      const pathD = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x * 256} ${(1 - p.y) * 256}`)
        .join(" ");

      return (
        <View key={channel.key} style={styles.channelRow}>
          <Text style={[styles.channelLabel, { color: channel.color }]}>
            {channel.label}
          </Text>
          <Svg width={256} height={256} style={styles.svg}>
            {/* Grid */}
            {[0, 64, 128, 192, 256].map((g) => (
              <React.Fragment key={g}>
                <Line x1={g} y1={0} x2={g} y2={256} stroke={COLORS.grid} strokeWidth={0.5} />
                <Line x1={0} y1={g} x2={256} y2={g} stroke={COLORS.grid} strokeWidth={0.5} />
              </React.Fragment>
            ))}
            {/* Baseline */}
            <Line x1={0} y1={256} x2={256} y2={0} stroke={COLORS.grid} strokeWidth={1} strokeDasharray="4,4" />
            {/* Curve */}
            <Path d={pathD} stroke={channel.color} strokeWidth={2} fill="none" />
            {/* Control points */}
            {points.map((p, i) => (
              <Circle
                key={i}
                cx={p.x * 256}
                cy={(1 - p.y) * 256}
                r={5}
                fill={channel.color}
                stroke="#000"
                strokeWidth={1}
              />
            ))}
          </Svg>
        </View>
      );
    },
    [curve]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tone Curve</Text>
      <View style={styles.channelList}>
        {CHANNELS.map(renderChannelTab)}
      </View>
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
  channelList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  channelRow: {
    alignItems: "center",
  },
  channelLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  svg: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
});
