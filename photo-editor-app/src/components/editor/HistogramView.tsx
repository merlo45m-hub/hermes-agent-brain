import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { useEditStore } from "@/stores/editStore";

const COLORS = {
  r: "rgba(244, 67, 54, 0.6)",
  g: "rgba(76, 175, 80, 0.6)",
  b: "rgba(33, 150, 243, 0.6)",
  luminance: "rgba(255, 255, 255, 0.4)",
};

export function HistogramView() {
  const histogram = useEditStore((s) => s.histogram);

  const renderBars = (
    data: number[] | undefined,
    color: string
  ) => {
    if (!data || data.length === 0) return null;
    const maxVal = Math.max(...data, 1);
    const barWidth = 120 / 256;

    return data.map((val, i) => {
      const h = Math.max(1, (val / maxVal) * 56);
      return (
        <Rect
          key={i}
          x={i * barWidth}
          y={56 - h} // top-down SVG
          width={Math.max(0.5, barWidth - 0.5)}
          height={h}
          fill={color}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <Svg width={120} height={60}>
        {renderBars(histogram?.r, COLORS.r)}
        {renderBars(histogram?.g, COLORS.g)}
        {renderBars(histogram?.b, COLORS.b)}
        {renderBars(histogram?.luminance, COLORS.luminance)}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 6,
    padding: 2,
  },
});
