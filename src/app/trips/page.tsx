"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import TripCard from "@/components/trips/TripCard"
import TripsEmpty from "@/components/trips/TripsEmpty"
import CreateTripDialog from "@/components/trips/CreateTripDialog"
import { useTripsStore } from "@/store/tripsStore"

export default function TripsPage() {
  const trips      = useTripsStore((state) => state.trips)
  const fetchTrips = useTripsStore((state) => state.fetchTrips)

  useEffect(() => {
    fetchTrips()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchTrips()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [fetchTrips])

  // ── Empty state ───────────────────────────────────────────────────────────
  if (trips.length === 0) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-[#E8F3FF] to-white flex flex-col">
        {/* 상단 헤더 영역 */}
        <div className="bg-gradient-to-br from-primary to-[#3FA0FF] px-5 pt-8 pb-10 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-10 -right-12 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.15)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-36 h-36 rounded-full bg-[radial-gradient(circle,rgba(255,211,64,.12)_0%,transparent_70%)]" />
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-medium mb-1">내 여행 목록</p>
            <h1 className="text-[1.75rem] font-black text-white tracking-tight leading-tight">
              어디로 떠날까요? ✈️
            </h1>
          </div>
        </div>

        {/* TripsEmpty 컴포넌트 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-4">
          <div className="w-full bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,80,200,.12)] border border-blue-50 overflow-hidden">
            <TripsEmpty />
          </div>
        </div>
      </div>
    )
  }

  // ── 여행 목록 ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full min-h-[calc(100vh-58px)] bg-[#F0F6FF]">

      {/* ── Hero 헤더 ── */}
      <div className="bg-primary px-5 pt-8 pb-10 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-10 -right-12 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.15)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-36 h-36 rounded-full bg-[radial-gradient(circle,rgba(255,211,64,.12)_0%,transparent_70%)]" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">내 여행 목록</p>
            <h1 className="text-[1.75rem] font-black text-white tracking-tight leading-tight">
              나의 여행 ✈️
            </h1>
            <p className="text-white/70 text-sm font-medium mt-1">
              총 {trips.length}개의 여행
            </p>
          </div>

          {/* 새 여행 추가 버튼 */}
          <div className="mt-1">
            <CreateTripDialog variant="iconBox" />
          </div>
        </div>
      </div>

      {/* ── 여행 카드 목록 ── */}
      {/* 헤더에서 살짝 올라오는 카드 컨테이너 */}
      <div className="px-4 -mt-4 pb-24 space-y-3">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  )
}