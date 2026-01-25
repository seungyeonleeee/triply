import { create } from "zustand";

interface TripState {
  selectedTripId: string | null;
  setSelectedTrip: (id: string) => void;
}

export const useTripStore = create<TripState>((set) => ({
  selectedTripId: null,
  setSelectedTrip: (id) => set({ selectedTripId: id }),
}));
