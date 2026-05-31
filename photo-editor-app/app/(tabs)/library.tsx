import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import {
  FolderPlus,
  ImagePlus,
  Search,
  Star,
  Flag,
  MoreHorizontal,
  Grid3x3,
  List,
  ArrowUpDown,
  SlidersHorizontal,
  Check,
  X,
  Tag,
} from "lucide-react-native";
import { usePhotoStore } from "@/stores/photoStore";
import type { Photo, PhotoFlag, PhotoRating, ColorLabel } from "@/types";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_COLS = 3;
const GRID_GAP = 2;
const GRID_SIZE = (SCREEN_WIDTH - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

const COLORS = {
  bg: "#0a0a0a",
  surface: "#121212",
  surface2: "#1a1a1a",
  text: "#f0f0f0",
  textSecondary: "#999",
  accent: "#4A9EFF",
  pick: "#4CAF50",
  reject: "#F44336",
  danger: "#F44336",
  border: "#222",
};

export default function LibraryScreen() {
  const router = useRouter();
  const store = usePhotoStore();

  const filteredPhotos = useMemo(() => {
    let photos = [...store.photos];

    // Album filter
    if (store.currentAlbumId) {
      photos = photos.filter((p) => p.albumIds.includes(store.currentAlbumId!));
    }

    // Flag filter
    if (store.filterFlag !== "all") {
      photos = photos.filter((p) => p.flag === store.filterFlag);
    }

    // Rating filter
    if (store.filterRating > 0) {
      photos = photos.filter((p) => p.rating >= store.filterRating);
    }

    // Label filter
    if (store.filterLabel !== "all") {
      photos = photos.filter((p) => p.label === store.filterLabel);
    }

    // Search
    if (store.searchQuery) {
      const q = store.searchQuery.toLowerCase();
      photos = photos.filter(
        (p) =>
          p.filename.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    photos.sort((a, b) => {
      let cmp = 0;
      switch (store.sortBy) {
        case "name":
          cmp = a.filename.localeCompare(b.filename);
          break;
        case "rating":
          cmp = b.rating - a.rating;
          break;
        case "size":
          cmp = b.fileSize - a.fileSize;
          break;
        default:
          cmp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return store.sortDirection === "asc" ? -cmp : cmp;
    });

    return photos;
  }, [
    store.photos,
    store.currentAlbumId,
    store.filterFlag,
    store.filterRating,
    store.filterLabel,
    store.searchQuery,
    store.sortBy,
    store.sortDirection,
  ]);

  const handleImport = useCallback(async () => {
    // In a real Expo app, use expo-image-picker:
    // const result = await launchImageLibraryAsync({ selectionLimit: 10, mediaTypes: ['images'] });
    // store.importPhotos(result.assets.map(a => a.uri));
    store.importPhotos([`demo://photo_${Date.now()}`]);
  }, [store]);

  const renderPhoto = useCallback(
    ({ item }: { item: Photo }) => {
      const isSelected = store.selectedPhotoIds.includes(item.id);
      return (
        <TouchableOpacity
          style={[styles.photoTile, isSelected && styles.photoTileSelected]}
          onPress={() => router.push(`/photo/${item.id}`)}
          onLongPress={() => store.togglePhotoSelection(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderIcon}>🖼️</Text>
          </View>
          {item.flag === "pick" && (
            <View style={[styles.flagBadge, { backgroundColor: COLORS.pick }]}>
              <Check size={10} color="#fff" />
            </View>
          )}
          {item.flag === "reject" && (
            <View style={[styles.flagBadge, { backgroundColor: COLORS.reject }]}>
              <X size={10} color="#fff" />
            </View>
          )}
          {item.rating > 0 && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{"★".repeat(item.rating)}</Text>
            </View>
          )}
          {isSelected && (
            <View style={styles.selectedOverlay}>
              <Check size={24} color={COLORS.accent} />
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [store, router]
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Library</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleImport}>
          <ImagePlus size={20} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <FolderPlus size={20} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Search size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderToolbar = () => (
    <View style={styles.toolbar}>
      <TouchableOpacity
        style={styles.toolBtn}
        onPress={() => store.setViewMode(store.viewMode === "grid" ? "list" : "grid")}
      >
        {store.viewMode === "grid" ? (
          <List size={18} color={COLORS.textSecondary} />
        ) : (
          <Grid3x3 size={18} color={COLORS.textSecondary} />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.toolBtn} onPress={() => store.toggleSortDirection()}>
        <ArrowUpDown size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toolBtn}>
        <SlidersHorizontal size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      <Text style={styles.photoCount}>
        {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? "s" : ""}
      </Text>
    </View>
  );

  const renderSelectionBar = () => {
    if (store.selectedPhotoIds.length === 0) return null;
    return (
      <View style={styles.selectionBar}>
        <TouchableOpacity onPress={store.clearSelection}>
          <X size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.selectionText}>
          {store.selectedPhotoIds.length} selected
        </Text>
        <TouchableOpacity>
          <Star size={20} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Tag size={20} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Flag size={20} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            store.removePhotos(store.selectedPhotoIds);
            store.clearSelection();
          }}
        >
          <Text style={{ color: COLORS.danger, fontWeight: "600" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {renderHeader()}
      {renderToolbar()}
      {renderSelectionBar()}
      <FlatList
        data={filteredPhotos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id}
        numColumns={GRID_COLS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: GRID_GAP }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ImagePlus size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No photos yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to import photos
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface2,
    justifyContent: "center",
    alignItems: "center",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  toolBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  photoCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  grid: {
    padding: GRID_GAP,
  },
  photoTile: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    overflow: "hidden",
  },
  photoTileSelected: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface2,
  },
  photoPlaceholderIcon: {
    fontSize: 32,
  },
  flagBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingBadge: {
    position: "absolute",
    top: 2,
    right: 2,
  },
  ratingText: {
    fontSize: 10,
    color: "#FFD700",
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(74, 158, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  selectionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    gap: 16,
  },
  selectionText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 120,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
