import { create } from "zustand";
import { Trip, Place } from "@/types/trip";

interface TripsState {
  trips: Trip[];
  addTrip: (trip: Trip) => void;
  addPlace: (tripId: string, place: Place) => void;
  updatePlace: (
    tripId: string,
    placeId: string,
    data: Partial<Place>
  ) => void;
  removePlace: (tripId: string, placeId: string) => void;
  removeTrip: (tripId: string) => void;
  getTripById: (id: string) => Trip | undefined;
}

export const useTripsStore = create<TripsState>((set, get) => ({
  trips: [],

  addTrip: (trip) =>
    set((state) => ({
      trips: [...state.trips, trip],
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
}));
