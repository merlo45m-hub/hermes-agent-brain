import { create } from "zustand";
import type { Photo, Album, PhotoRating, ColorLabel, PhotoFlag } from "@/types";

interface PhotoState {
  // Data
  photos: Photo[];
  albums: Album[];
  selectedPhotoIds: string[];
  currentAlbumId: string | null;

  // Library view
  viewMode: "grid" | "list";
  sortBy: "date" | "name" | "rating" | "size";
  sortDirection: "asc" | "desc";
  filterFlag: PhotoFlag | "all";
  filterRating: number; // minimum rating, 0 = all
  filterLabel: ColorLabel | "all";
  searchQuery: string;

  // Actions
  importPhotos: (uris: string[]) => Promise<void>;
  removePhotos: (ids: string[]) => void;
  setRating: (id: string, rating: PhotoRating) => void;
  setLabel: (id: string, label: ColorLabel) => void;
  setFlag: (id: string, flag: PhotoFlag) => void;
  togglePhotoSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  createAlbum: (name: string) => string;
  addToAlbum: (photoIds: string[], albumId: string) => void;
  removeFromAlbum: (photoIds: string[], albumId: string) => void;
  deleteAlbum: (albumId: string) => void;
  setViewMode: (mode: "grid" | "list") => void;
  setSortBy: (sort: "date" | "name" | "rating" | "size") => void;
  toggleSortDirection: () => void;
  setFilterFlag: (flag: PhotoFlag | "all") => void;
  setFilterRating: (rating: number) => void;
  setFilterLabel: (label: ColorLabel | "all") => void;
  setSearchQuery: (query: string) => void;
  setCurrentAlbum: (albumId: string | null) => void;
}

let _photoCounter = 0;

export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [],
  albums: [],
  selectedPhotoIds: [],
  currentAlbumId: null,
  viewMode: "grid",
  sortBy: "date",
  sortDirection: "desc",
  filterFlag: "all",
  filterRating: 0,
  filterLabel: "all",
  searchQuery: "",

  importPhotos: async (uris) => {
    const photos: Photo[] = uris.map((uri, i) => {
      const id = `photo_${Date.now()}_${_photoCounter++}`;
      const filename = uri.split("/").pop() || `photo_${i}.jpg`;
      return {
        id,
        uri,
        filename,
        width: 0,
        height: 0,
        fileSize: 0,
        mimeType: "image/jpeg",
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        rating: 0,
        label: "none",
        flag: "none",
        albumIds: [],
        tags: [],
        exif: {},
      };
    });
    set((s) => ({ photos: [...photos, ...s.photos] }));
  },

  removePhotos: (ids) => {
    set((s) => ({
      photos: s.photos.filter((p) => !ids.includes(p.id)),
      selectedPhotoIds: s.selectedPhotoIds.filter((sid) => !ids.includes(sid)),
    }));
  },

  setRating: (id, rating) => {
    set((s) => ({
      photos: s.photos.map((p) => (p.id === id ? { ...p, rating } : p)),
    }));
  },

  setLabel: (id, label) => {
    set((s) => ({
      photos: s.photos.map((p) => (p.id === id ? { ...p, label } : p)),
    }));
  },

  setFlag: (id, flag) => {
    set((s) => ({
      photos: s.photos.map((p) => (p.id === id ? { ...p, flag } : p)),
    }));
  },

  togglePhotoSelection: (id) => {
    set((s) => ({
      selectedPhotoIds: s.selectedPhotoIds.includes(id)
        ? s.selectedPhotoIds.filter((sid) => sid !== id)
        : [...s.selectedPhotoIds, id],
    }));
  },

  selectAll: () => {
    const state = get();
    set({ selectedPhotoIds: state.photos.map((p) => p.id) });
  },

  clearSelection: () => set({ selectedPhotoIds: [] }),

  createAlbum: (name) => {
    const id = `album_${Date.now()}`;
    const album: Album = {
      id,
      name,
      coverPhotoId: null,
      photoCount: 0,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ albums: [...s.albums, album] }));
    return id;
  },

  addToAlbum: (photoIds, albumId) => {
    set((s) => ({
      photos: s.photos.map((p) =>
        photoIds.includes(p.id) && !p.albumIds.includes(albumId)
          ? { ...p, albumIds: [...p.albumIds, albumId] }
          : p
      ),
      albums: s.albums.map((a) =>
        a.id === albumId
          ? {
              ...a,
              photoCount: s.photos.filter(
                (p) =>
                  (photoIds.includes(p.id) && !p.albumIds.includes(albumId)) ||
                  p.albumIds.includes(albumId)
              ).length,
              coverPhotoId: a.coverPhotoId ?? photoIds[0],
            }
          : a
      ),
    }));
  },

  removeFromAlbum: (photoIds, albumId) => {
    set((s) => ({
      photos: s.photos.map((p) =>
        photoIds.includes(p.id)
          ? { ...p, albumIds: p.albumIds.filter((a) => a !== albumId) }
          : p
      ),
      albums: s.albums.map((a) =>
        a.id === albumId
          ? { ...a, photoCount: Math.max(0, a.photoCount - photoIds.length) }
          : a
      ),
    }));
  },

  deleteAlbum: (albumId) => {
    set((s) => ({
      albums: s.albums.filter((a) => a.id !== albumId),
      photos: s.photos.map((p) => ({
        ...p,
        albumIds: p.albumIds.filter((a) => a !== albumId),
      })),
    }));
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setSortBy: (sort) => set({ sortBy: sort }),
  toggleSortDirection: () =>
    set((s) => ({ sortDirection: s.sortDirection === "asc" ? "desc" : "asc" })),
  setFilterFlag: (flag) => set({ filterFlag: flag }),
  setFilterRating: (rating) => set({ filterRating: rating }),
  setFilterLabel: (label) => set({ filterLabel: label }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCurrentAlbum: (albumId) => set({ currentAlbumId: albumId }),
}));
