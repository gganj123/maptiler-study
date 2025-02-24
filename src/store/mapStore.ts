import { useEffect } from 'react';
import { create } from 'zustand';

interface Marker {
  id: string;
  lng: number;
  lat: number;
}

interface MapState {
  center: [number, number];
  zoom: number;
  is3D: boolean;
  markers: Marker[];
  setCenter: (lng: number, lat: number) => void;
  setZoom: (zoom: number) => void;
  toggle3D: () => void;
  addMarker: (lng: number, lat: number) => void;
  removeMarker: (id: string) => void;
  loadMarkers: () => void;
}

const loadMarkersFromStorage = (): Marker[] => {
  if (typeof window !== 'undefined') {
    const storedMarkers = localStorage.getItem('markers');
    return storedMarkers ? JSON.parse(storedMarkers) : [];
  }
  return [];
};

const useMapStore = create<MapState>((set) => ({
  center: [126.9779692, 37.566535],
  zoom: 12,
  is3D: false,
  markers: [],

  setCenter: (lng, lat) => set({ center: [lng, lat] }),
  setZoom: (zoom) => set({ zoom }),
  toggle3D: () => set((state) => ({ is3D: !state.is3D })),

  addMarker: (lng, lat) =>
    set((state) => {
      const newMarkers = [
        ...state.markers,
        { id: crypto.randomUUID(), lng, lat },
      ];
      localStorage.setItem('markers', JSON.stringify(newMarkers));
      return { markers: newMarkers };
    }),

  removeMarker: (id) =>
    set((state) => {
      const newMarkers = state.markers.filter((marker) => marker.id !== id);
      localStorage.setItem('markers', JSON.stringify(newMarkers));
      return { markers: newMarkers };
    }),

  loadMarkers: () =>
    set(() => {
      const loadedMarkers = loadMarkersFromStorage();
      return { markers: loadedMarkers };
    }),
}));

export function useLoadMarkers() {
  const loadMarkers = useMapStore((state) => state.loadMarkers);

  useEffect(() => {
    loadMarkers();
  }, [loadMarkers]);
}

export default useMapStore;
