import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Star,
  Flag,
  Tag,
  Edit3,
  Share2,
  Trash2,
  ChevronRight,
  Check,
  X,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePhotoStore } from "@/stores/photoStore";
import { useEditStore } from "@/stores/editStore";
import type { PhotoRating, ColorLabel, PhotoFlag } from "@/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const COLORS = {
  bg: "#0a0a0a",
  surface: "#121212",
  surface2: "#1a1a1a",
  text: "#f0f0f0",
  textSecondary: "#999",
  accent: "#4A9EFF",
  border: "#222",
  pick: "#4CAF50",
  reject: "#F44336",
  danger: "#F44336",
  star: "#FFD700",
};

const RATINGS: { value: PhotoRating; label: string }[] = [
  { value: 0, label: "No rating" },
  { value: 1, label: "★" },
  { value: 2, label: "★★" },
  { value: 3, label: "★★★" },
  { value: 4, label: "★★★★" },
  { value: 5, label: "★★★★★" },
];

const LABELS: { value: ColorLabel; color: string; label: string }[] = [
  { value: "none", color: "#666", label: "None" },
  { value: "red", color: "#F44336", label: "Red" },
  { value: "yellow", color: "#FFEB3B", label: "Yellow" },
  { value: "green", color: "#4CAF50", label: "Green" },
  { value: "blue", color: "#2196F3", label: "Blue" },
  { value: "purple", color: "#9C27B0", label: "Purple" },
];

export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const store = usePhotoStore();
  const editStore = useEditStore();

  const photo = store.photos.find((p) => p.id === id);

  const handleEdit = useCallback(() => {
    if (photo) {
      editStore.loadPhoto(photo.uri, photo.width || 4000, photo.height || 3000);
    }
    router.push("/(tabs)/edit");
  }, [photo, editStore, router]);

  if (!photo) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Photo not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle} numberOfLines={1}>
          {photo.filename}
        </Text>
        <View style={styles.topActions}>
          <TouchableOpacity
            onPress={() => store.removePhotos([photo.id])}
          >
            <Trash2 size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Photo preview */}
      <View style={styles.photoContainer}>
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoIcon}>🖼️</Text>
        </View>
      </View>

      <ScrollView style={styles.details}>
        {/* Rating */}
        <Text style={styles.sectionTitle}>Rating</Text>
        <View style={styles.ratingRow}>
          {RATINGS.map(({ value, label }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.ratingBtn,
                photo.rating === value && styles.ratingBtnActive,
              ]}
              onPress={() => store.setRating(photo.id, value)}
            >
              <Text
                style={[
                  styles.ratingBtnText,
                  photo.rating === value && { color: COLORS.star },
                  value === 0 && photo.rating === 0 && { color: COLORS.accent },
                ]}
              >
                {value === 0 ? "—" : label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Color labels */}
        <Text style={styles.sectionTitle}>Color Label</Text>
        <View style={styles.labelRow}>
          {LABELS.map(({ value, color, label }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.labelChip,
                { borderColor: color },
                photo.label === value && { backgroundColor: color + "20" },
              ]}
              onPress={() => store.setLabel(photo.id, value)}
            >
              <View style={[styles.labelDot, { backgroundColor: color }]} />
              <Text
                style={[
                  styles.labelText,
                  photo.label === value && { color, fontWeight: "700" },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Flag */}
        <Text style={styles.sectionTitle}>Flag</Text>
        <View style={styles.flagRow}>
          <TouchableOpacity
            style={[styles.flagBtn, photo.flag === "pick" && { backgroundColor: COLORS.pick + "20", borderColor: COLORS.pick }]}
            onPress={() => store.setFlag(photo.id, photo.flag === "pick" ? "none" : "pick")}
          >
            <Check size={18} color={photo.flag === "pick" ? COLORS.pick : COLORS.textSecondary} />
            <Text style={[styles.flagText, photo.flag === "pick" && { color: COLORS.pick }]}>
              Pick
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flagBtn, photo.flag === "reject" && { backgroundColor: COLORS.reject + "20", borderColor: COLORS.reject }]}
            onPress={() => store.setFlag(photo.id, photo.flag === "reject" ? "none" : "reject")}
          >
            <X size={18} color={photo.flag === "reject" ? COLORS.reject : COLORS.textSecondary} />
            <Text style={[styles.flagText, photo.flag === "reject" && { color: COLORS.reject }]}>
              Reject
            </Text>
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={handleEdit}>
          <Edit3 size={18} color={COLORS.text} />
          <Text style={styles.actionText}>Edit Photo</Text>
          <ChevronRight size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Share2 size={18} color={COLORS.text} />
          <Text style={styles.actionText}>Share</Text>
          <ChevronRight size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* Info */}
        <Text style={styles.sectionTitle}>Info</Text>
        <View style={styles.infoGrid}>
          <InfoRow label="Filename" value={photo.filename} />
          <InfoRow label="Dimensions" value={`${photo.width} × ${photo.height}`} />
          <InfoRow label="Format" value={photo.mimeType} />
          <InfoRow label="Imported" value={new Date(photo.createdAt).toLocaleDateString()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value || "—"}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  backLink: {
    fontSize: 14,
    color: COLORS.accent,
    marginTop: 8,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  topTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginHorizontal: 12,
  },
  topActions: {
    flexDirection: "row",
    gap: 4,
  },
  photoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholder: {
    flex: 1,
    width: "100%",
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  photoIcon: {
    fontSize: 72,
  },
  details: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    gap: 6,
  },
  ratingBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.surface2,
  },
  ratingBtnActive: {
    backgroundColor: COLORS.star + "15",
  },
  ratingBtnText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  labelRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  labelChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  labelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  labelText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  flagRow: {
    flexDirection: "row",
    gap: 10,
  },
  flagBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
  },
  flagText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface2,
    borderRadius: 10,
    padding: 14,
    marginBottom: 6,
    gap: 10,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  infoGrid: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
  },
});
