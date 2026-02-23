"use client"

import { supabase } from "@/lib/supabaseClient"
import type { Trip, Place, ChecklistItem } from "@/types/trip"

// DB → UI 타입 변환 함수
function mapTrip(row: any): Trip {
  return {
    id: row.id,
    title: row.title,
    startDate: row.start_date,
    endDate: row.end_date,
    companions: row.companions,
    travelStyles: row.travel_styles ?? [],
    createdAt: row.created_at,
    places: row.trip_places ?? [],
    checklist: row.trip_checklists ?? [],
  }
}

export const TripService = {
  async getTrips(): Promise<Trip[]> {

    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data.map(mapTrip)
  },

  async getTripDetail(tripId: string): Promise<Trip> {
    const { data, error } = await supabase
      .from("trips")
      .select(`
        *,
        trip_places (*),
        trip_checklists (*)
      `)
      .eq("id", tripId)
      .single()

    if (error) throw error
    return mapTrip(data)
  },

  async createTrip(payload: Partial<Trip>) {
    // user 가져오기
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!userData.user) throw new Error("User not authenticated")

    // DB insert (user_id 포함)
    const { data, error } = await supabase
      .from("trips")
      .insert({
        title: payload.title,
        companions: payload.companions,
        start_date: payload.startDate,
        end_date: payload.endDate,
        travel_styles: payload.travelStyles,
        user_id: userData.user.id,
      })
      .select()
      .single()

    if (error) throw error
    return mapTrip(data)
  },

  async updateTrip(id: string, payload: Partial<Trip>) {
    const { error } = await supabase
      .from("trips")
      .update({
        title: payload.title,
        companions: payload.companions,
        start_date: payload.startDate,
        end_date: payload.endDate,
        travel_styles: payload.travelStyles,
      })
      .eq("id", id)

    if (error) throw error
  },

  async deleteTrip(id: string) {
    const { error } = await supabase.from("trips").delete().eq("id", id)
    if (error) throw error
  },
}

// Place 관련 서비스
export const PlaceService = {
  async addPlace(place: any): Promise<Place> {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id

    const { data, error } = await supabase
      .from("trip_places")
      .insert({
        id: place.id,
        trip_id: place.trip_id,
        user_id: userId,
        name: place.name,
        day: place.day,
        type: place.type,
        time: place.time,
        category: place.category,
        transport_kind: place.transportKind, 
        address: place.address,
        lat: place.lat,
        lng: place.lng,
        memo: place.memo,
      })
      .select()
      .single()

    if (error) throw error
    return {
      ...data,
      transportKind: data.transport_kind,
    }
  },

  async updatePlace(id: string, payload: Partial<Place>) {
    const { data: userData } = await supabase.auth.getUser()

    const { error } = await supabase
      .from("trip_places")
      .update({
        name: payload.name,
        day: payload.day,
        type: payload.type,
        time: payload.time,
        category: payload.category,
        transport_kind: payload.transportKind,
        address: payload.address,
        lat: payload.lat,
        lng: payload.lng,
        memo: payload.memo,
        user_id: userData.user?.id,
      })
      .eq("id", id)
      console.log("payload:", payload)

    if (error) throw error
  },

  async deletePlace(id: string) {
    const { error } = await supabase
      .from("trip_places")
      .delete()
      .eq("id", id)

    if (error) throw error
  },
}

// Checklist 관련 서비스
export const ChecklistService = {
  async addItem(item: any): Promise<ChecklistItem> {
    const { data: userData } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from("trip_checklists")
      .insert({
        ...item,
        user_id: userData.user?.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateItem(id: string, checked: boolean) {
    const { error } = await supabase
      .from("trip_checklists")
      .update({ checked })
      .eq("id", id)

    if (error) throw error
  },

  async deleteItem(id: string) {
    const { error } = await supabase
      .from("trip_checklists")
      .delete()
      .eq("id", id)

    if (error) throw error
  },
}