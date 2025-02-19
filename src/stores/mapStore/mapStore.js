import { create } from "zustand";

const useMapStore = create((set) => ({
  is3D: false,
  toggle3D: () => set((state) => ({ is3D: !state.is3D })),
}));

export default useMapStore;
