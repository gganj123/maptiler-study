import { create } from 'zustand';
import * as maptilersdk from '@maptiler/sdk';

interface MapState {
  map: maptilersdk.Map | null;
  center: [number, number];
  zoom: number;
  is3D: boolean;
  setMapInstance: (map: maptilersdk.Map) => void;
}

const useMapStore = create<MapState>((set) => ({
  map: null,
  center: [126.978, 37.566], // 서울
  zoom: 12,
  is3D: false,
  setMapInstance: (map) => set({ map }),
}));

export default useMapStore;
