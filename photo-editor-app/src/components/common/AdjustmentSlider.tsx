import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  TextInput,
} from "react-native";
import { useState } from "react";

const COLORS = {
  text: "#f0f0f0",
  textSecondary: "#999",
  accent: "#4A9EFF",
  surface2: "#1a1a1a",
  track: "#333",
};

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function AdjustmentSlider({ label, value, min, max, onChange }: Props) {
  const [showInput, setShowInput] = useState(false);
  const trackRef = useRef<View>(null);
  const trackWidth = useRef(200);

  const progress = ((value - min) / (max - min)) * 100;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        updateValue(evt);
      },
      onPanResponderMove: (evt) => {
        updateValue(evt);
      },
    })
  ).current;

  const updateValue = useCallback(
    (evt: GestureResponderEvent) => {
      // Approximate: use pageX displacement from a reference point
      // In production, measure the track element's absolute position
      trackRef.current?.measure((_x, _y, width, _h, pageX) => {
        const ratio = Math.max(0, Math.min(1, (evt.nativeEvent.pageX - pageX) / width));
        const newVal = Math.round(min + ratio * (max - min));
        onChange(Math.max(min, Math.min(max, newVal)));
      });
    },
    [min, max, onChange]
  );

  const handleLongPress = useCallback(() => {
    setShowInput((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {showInput ? (
          <TextInput
            style={styles.input}
            value={String(value)}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={(e) => {
              const n = Number(e.nativeEvent.text);
              if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
              setShowInput(false);
            }}
            onBlur={() => setShowInput(false)}
            autoFocus
            selectTextOnFocus
          />
        ) : (
          <Text style={styles.value} onLongPress={handleLongPress}>
            {value}
          </Text>
        )}
      </View>
      <View
        ref={trackRef}
        style={styles.track}
        {...panResponder.panHandlers}
      >
        <View style={[styles.fill, { width: `${progress}%` }]} />
        <View
          style={[
            styles.thumb,
            { left: `${progress}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  value: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "600",
    minWidth: 30,
    textAlign: "right",
  },
  input: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: "600",
    backgroundColor: COLORS.surface2,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 40,
    textAlign: "right",
  },
  track: {
    height: 20,
    backgroundColor: COLORS.track,
    borderRadius: 3,
    justifyContent: "center",
    position: "relative",
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.accent,
    borderRadius: 3,
    opacity: 0.6,
  },
  thumb: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.accent,
    marginLeft: -7,
    top: 3,
  },
});
