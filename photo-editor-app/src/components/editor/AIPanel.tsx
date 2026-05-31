import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Sparkles,
  Scissors,
  Eraser,
  Palette,
  Smile,
  Tags,
  Download,
  Lock,
} from "lucide-react-native";
import { useAIStore } from "@/stores/aiStore";
import type { AIFeature } from "@/types";
import { AI_MODEL_SIZES } from "@/stores/aiStore";

const COLORS = {
  text: "#f0f0f0",
  textSecondary: "#999",
  accent: "#4A9EFF",
  surface: "#121212",
  surface2: "#1a1a1a",
  border: "#222",
  warning: "#FFA726",
};

interface AIFeatureCard {
  feature: AIFeature;
  label: string;
  description: string;
  icon: React.ReactNode;
  runsOnDevice: boolean;
}

const FEATURES: AIFeatureCard[] = [
  {
    feature: "autoEnhance",
    label: "Auto Enhance",
    description: "One-tap ML exposure, white balance, and contrast adjustment",
    icon: <Sparkles size={24} />,
    runsOnDevice: true,
  },
  {
    feature: "backgroundRemoval",
    label: "Background Removal",
    description: "Isolate subject from background with one tap",
    icon: <Scissors size={24} />,
    runsOnDevice: true,
  },
  {
    feature: "objectRemoval",
    label: "Object Removal",
    description: "Brush over objects to remove them with AI inpainting",
    icon: <Eraser size={24} />,
    runsOnDevice: false,
  },
  {
    feature: "styleTransfer",
    label: "Style Transfer",
    description: "Apply artistic styles or reference-image looks",
    icon: <Palette size={24} />,
    runsOnDevice: false,
  },
  {
    feature: "portraitRetouch",
    label: "Face Retouching",
    description: "Skin smoothing, eye brightening, teeth whitening",
    icon: <Smile size={24} />,
    runsOnDevice: true,
  },
  {
    feature: "smartCategorization",
    label: "Smart Tags",
    description: "Auto-tag photos by category (portrait, landscape, etc.)",
    icon: <Tags size={24} />,
    runsOnDevice: true,
  },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "Cloud";
  if (bytes < 1_000_000) return `${Math.round(bytes / 1000)} KB`;
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

export function AIPanel() {
  const features = useAIStore((s) => s.features);
  const modelDownloads = useAIStore((s) => s.modelDownloads);
  const enableFeature = useAIStore((s) => s.enableFeature);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Sparkles size={18} color={COLORS.accent} />
        <Text style={styles.title}>AI Tools (Phase 2)</Text>
        <View style={styles.badge}>
          <Lock size={10} color={COLORS.warning} />
          <Text style={styles.badgeText}>Preview</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        AI features are disabled in Phase 1. Enable feature flags below to
        scaffold integration points.
      </Text>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {FEATURES.map((card) => {
          const isOn = features[card.feature];
          const dl = modelDownloads[card.feature];

          return (
            <TouchableOpacity
              key={card.feature}
              style={[styles.card, isOn && styles.cardActive]}
              onPress={() => enableFeature(card.feature)}
              disabled={true} // Phase 1: disabled
            >
              <View style={styles.cardLeft}>
                <View
                  style={[
                    styles.iconBox,
                    isOn && { backgroundColor: "rgba(74, 158, 255, 0.1)" },
                  ]}
                >
                  {React.cloneElement(card.icon as React.ReactElement, {
                    color: isOn ? COLORS.accent : COLORS.textSecondary,
                  })}
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, isOn && styles.cardTitleActive]}>
                    {card.label}
                  </Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {card.description}
                  </Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.metaText}>
                      {card.runsOnDevice ? "📱 On-device" : "☁️ API"}
                    </Text>
                    <Text style={styles.metaText}>
                      {formatBytes(AI_MODEL_SIZES[card.feature])}
                    </Text>
                    {dl.downloaded && (
                      <Text style={[styles.metaText, { color: "#4CAF50" }]}>
                        ✓ Downloaded
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Feature flag toggle placeholder */}
              <View
                style={[
                  styles.toggle,
                  isOn && { backgroundColor: COLORS.accent },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    isOn && { alignSelf: "flex-end" },
                  ]}
                />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(255, 167, 38, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.warning,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  list: {
    maxHeight: 240,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    opacity: 0.6,
  },
  cardActive: {
    borderColor: COLORS.accent,
    opacity: 1,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.surface2,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  cardTitleActive: {
    color: COLORS.accent,
  },
  cardDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  cardMeta: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  metaText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  toggle: {
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.surface2,
    padding: 2,
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});
