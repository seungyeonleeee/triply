import { create } from "zustand";
import { Trip, Place, ChecklistItem } from "@/types/trip";

interface TripsState {
  trips: Trip[];
  addTrip: (trip: Trip) => void;
  editTrip: (tripId: string, data: Partial<Trip>) => void;
  addPlace: (tripId: string, place: Place) => void;
  updatePlace: (
    tripId: string,
    placeId: string,
    data: Partial<Place>
  ) => void;
  removePlace: (tripId: string, placeId: string) => void;
  removeTrip: (tripId: string) => void;
  getTripById: (id: string) => Trip | undefined;
  addChecklistItem: (tripId: string, item: ChecklistItem) => void;
  toggleChecklistItem: (tripId: string, itemId: string) => void;
  removeChecklistItem: (tripId: string, itemId: string) => void;
  updateChecklistItem: (tripId: string, itemId: string, label: string) => void;
}

export const useTripsStore = create<TripsState>((set, get) => ({
  trips: [],

  addTrip: (trip) =>
    set((state) => ({
      trips: [...state.trips, trip],
    })),

  editTrip: (tripId, data) =>
  set((state) => ({
    trips: state.trips.map((trip) =>
      trip.id === tripId ? { ...trip, ...data } : trip
    ),
  })),

  addPlace: (tripId, place) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId
          ? { ...trip, places: [...trip.places, place] }
          : trip
      ),
    })),

  updatePlace: (tripId, placeId, data) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              places: trip.places.map((place) =>
                place.id === placeId ? { ...place, ...data } : place
              ),
            }
          : trip
      ),
    })),

  removePlace: (tripId, placeId) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              places: trip.places.filter(
                (place) => place.id !== placeId
              ),
            }
          : trip
      ),
    })),

  removeTrip: (tripId) =>
    set((state) => ({
      trips: state.trips.filter((trip) => trip.id !== tripId),
    })),

  getTripById: (id) => {
    return get().trips.find((trip) => trip.id === id);
  },

  addChecklistItem: (tripId, item) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              checklist: [...(trip.checklist ?? []), item],
            }
          : trip
      ),
    })),

  toggleChecklistItem: (tripId, itemId) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              checklist: trip.checklist?.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : trip
      ),
    })),

  removeChecklistItem: (tripId, itemId) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              checklist: trip.checklist?.filter((item) => item.id !== itemId),
            }
          : trip
      ),
    })),

  updateChecklistItem: (tripId, itemId, label) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              checklist: trip.checklist?.map((item) =>
                item.id === itemId ? { ...item, label } : item
              ),
            }
          : trip
      ),
    })),
}));
