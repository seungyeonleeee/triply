import { create } from "zustand";
import { Trip, Place, ChecklistItem } from "@/types/trip";
import { TripService, PlaceService, ChecklistService } from "@/services/trip.service"

interface TripsState {
  trips: Trip[];
  loading: boolean;

  fetchTrips: () => Promise<void>;
  fetchTripDetail: (id: string) => Promise<void>;

  addTrip: (payload: Partial<Trip>) => Promise<void>;
  updateTrip: (id: string, payload: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;

  addPlace: (tripId: string, place: Place) => Promise<void>;
  updatePlace: (tripId: string, placeId: string, payload: Partial<Place>) => Promise<void>;
  removePlace: (tripId: string, placeId: string) => Promise<void>;

  addChecklistItem: (tripId: string, item: ChecklistItem) => Promise<void>;
}

export const useTripsStore = create<TripsState>((set, get) => ({
  trips: [],
  loading: false,

  async fetchTrips() {
    set({ loading: true })
    const trips = await TripService.getTrips()
    set({ trips, loading: false })
  },

  async fetchTripDetail(id) {
    set({ loading: true })
    const trip = await TripService.getTripDetail(id)
    // set({ trips: get().trips.map(t => (t.id === id ? trip : t)), loading: false })
    set((state) => ({
      trips: [trip],
      loading: false,
    }))
  },

  async addTrip(payload) {
    const newTrip = await TripService.createTrip(payload)
    set({ trips: [newTrip, ...get().trips] })
  },

  async updateTrip(id, payload) {
    await TripService.updateTrip(id, payload)
    await get().fetchTripDetail(id)
  },

  async deleteTrip(id) {
    await TripService.deleteTrip(id)
    set({ trips: get().trips.filter(t => t.id !== id) })
  },

  async addPlace(tripId, place) {
    const newPlace = await PlaceService.addPlace({
      ...place,
      trip_id: tripId,
    })

    set({
      trips: get().trips.map(trip =>
        trip.id === tripId
          ? { ...trip, places: [...trip.places, newPlace] }
          : trip
      ),
    })
  },

  async updatePlace(tripId, placeId, payload) {
    await PlaceService.updatePlace(placeId, payload)
    await get().fetchTripDetail(tripId)
  },

  async removePlace(tripId, placeId) {
    await PlaceService.deletePlace(placeId)
    await get().fetchTripDetail(tripId)
  },

  async addChecklistItem(tripId, item) {
    const newItem = await ChecklistService.addItem({
      ...item,
      trip_id: tripId,
    })

    set({
      trips: get().trips.map(trip =>
        trip.id === tripId
          ? { ...trip, checklist: [...(trip.checklist ?? []), newItem] }
          : trip
      ),
    })
  },
}))