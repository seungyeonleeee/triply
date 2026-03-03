"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useTripsStore } from "@/store/tripsStore"
import { Button } from "@/components/ui/button"
import { PlaceDialog } from "@/components/trips/PlaceDialog"
import { DaySection } from "@/components/trips/DaySection"
import { TripEditDialog } from "@/components/trips/TripEditDialog"
import { ChecklistDialog } from "@/components/trips/ChecklistDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Place, Category, TransportKind, TripItemType } from "@/types/trip"
import type { TripItem } from "@/components/trips/TimelineList"
import { loadGoogleMaps } from "@/lib/googleMaps"

declare global {
  interface Window { google?: any }
}

// ── Haversine 직선 거리 (km) ──────────────────────────────────────────────
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// 아이템 배열 → 인접 거리 배열
// - 교통(transport/flight) 타입이면 null (뱃지 숨김)
// - lat/lng 없으면 null
// - 마지막 아이템은 null
function calcDistances(items: TripItem[]): (number | null)[] {
  return items.map((item, i) => {
    if (i === items.length - 1) return null
    const isTransport = (it: TripItem) => it.type === "transport" || it.type === "flight"
    if (isTransport(item) || isTransport(items[i + 1])) return null
    const { lat: lat1, lng: lng1 } = item
    const { lat: lat2, lng: lng2 } = items[i + 1]
    if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return null
    return haversineKm(lat1, lng1, lat2, lng2)
  })
}

async function geocodeAddress(addr: string): Promise<{ lat: number; lng: number } | null> {
  await loadGoogleMaps()
  if (!window.google?.maps) return null
  return new Promise((resolve) => {
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: addr }, (results: any, status: string) => {
      if (status === "OK" && results?.[0]) {
        const loc = results[0].geometry.location
        resolve({ lat: loc.lat(), lng: loc.lng() })
      } else resolve(null)
    })
  })
}

const STYLE_EMOJI: Record<string, string> = {
  "도시 탐방": "🏙️", "자연 힐링": "🌿", "맛집 투어": "🍽️",
  "액티비티": "🎡", "쇼핑": "🛍️", "인생샷": "📸",
  "문화 탐방": "🏛️", "휴양": "🏖️",
}

const COMPANION_EMOJI: Record<string, string> = {
  "혼자": "🧍", "친구": "👫", "연인": "💑",
  "가족": "👨‍👩‍👧", "부모님": "👴👵",
}

export default function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const router = useRouter()

  const trip        = useTripsStore((state) => state.trips.find((t: any) => t.id === tripId))
  const addPlace    = useTripsStore((state) => state.addPlace)
  const updatePlace = useTripsStore((state) => state.updatePlace)
  const removePlace = useTripsStore((state) => state.removePlace)
  const removeTrip  = useTripsStore((state) => state.deleteTrip)
  const editTrip    = useTripsStore((state) => state.updateTrip)

  const [loading, setLoading] = React.useState(true)
  const fetchTripDetail = useTripsStore((s) => s.fetchTripDetail)

  React.useEffect(() => {
    if (!tripId) return
    setLoading(true)
    fetchTripDetail(tripId).finally(() => setLoading(false))
  }, [tripId, fetchTripDetail])

  React.useEffect(() => {
    loadGoogleMaps().catch((e) => console.error("Google Maps preload failed", e))
  }, [])

  const generateDays = React.useCallback(() => {
    if (!trip?.startDate || !trip?.endDate) return []
    const start = new Date(trip.startDate)
    const end   = new Date(trip.endDate)
    const days: { day: number; date: Date; dateStr: string }[] = []
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({ day: days.length + 1, date: new Date(d), dateStr: `${d.getMonth() + 1}/${d.getDate()}` })
    }
    return days
  }, [trip?.startDate, trip?.endDate])

  const days = generateDays()

  const formatDate = (ds?: string) => {
    if (!ds) return ""
    const d = new Date(ds)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
  }

  const displayTitle = trip?.title ? `${trip.title} 여행` : "여행 제목"
  const displayDate  = trip?.startDate
    ? trip?.endDate
      ? `${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}`
      : formatDate(trip.startDate)
    : "날짜 미정"

  const tripDays    = days.length > 0 ? `${days.length - 1}박 ${days.length}일` : null
  const totalPlaces = (trip?.places ?? []).filter((p: any) => p.type === "place" || p.type === "stay").length

  const [openEditTrip,  setOpenEditTrip]  = React.useState(false)
  const [openAddPlace,  setOpenAddPlace]  = React.useState(false)
  const [openChecklist, setOpenChecklist] = React.useState(false)
  const [targetDay,     setTargetDay]     = React.useState<number>(1)
  const [placeName,     setPlaceName]     = React.useState("")
  const [placeTime,     setPlaceTime]     = React.useState("")
  const [placeCategory, setPlaceCategory] = React.useState<Category>("관광명소")
  const [transportKind, setTransportKind] = React.useState<TransportKind>("bus")
  const [placeMemo,     setPlaceMemo]     = React.useState("")
  const [address,       setAddress]       = React.useState("")
  const [coords,        setCoords]        = React.useState<{ lat?: number; lng?: number }>({})
  const [editingItem,   setEditingItem]   = React.useState<TripItem | null>(null)

  const onSaveTrip   = (data: Partial<TripItem>) => { if (trip) editTrip(trip.id, data) }
  const onDeleteTrip = () => { if (trip) { removeTrip(trip.id); router.push("/trips") } }

  const resetPlaceForm = () => {
    setPlaceName(""); setPlaceTime(""); setPlaceCategory("관광명소")
    setTransportKind("bus"); setPlaceMemo(""); setAddress(""); setCoords({}); setEditingItem(null)
  }

  const onAddPlace = async () => {
    console.log("🔥 onAddPlace called")
    if (!trip) return
    let lat = coords.lat
    let lng = coords.lng
    if (lat == null || lng == null) {
      const r = await geocodeAddress(address)
      if (r) { lat = r.lat; lng = r.lng; setCoords(r) }
    }
    const isTransport = placeCategory === "교통"
    const isStay      = placeCategory === "숙소"
    const isFlight    = isTransport && transportKind === "flight"
    const type: TripItemType = isFlight ? "flight" : isTransport ? "transport" : isStay ? "stay" : "place"

    const payload: Place = {
      id: editingItem?.id || crypto.randomUUID(),
      name: placeName.trim() || address.split(" ").slice(0, 4).join(" "),
      day: targetDay, type,
      time: placeTime.trim() || undefined,
      category: placeCategory,
      transportKind: isTransport ? transportKind : undefined,
      memo: placeMemo.trim() || undefined,
      address: address || "", lat, lng,
    }

    editingItem ? updatePlace(trip.id, editingItem.id, payload) : addPlace(trip.id, payload)
    resetPlaceForm()
    setOpenAddPlace(false)
  }

  const onDeletePlace = () => {
    if (!trip || !editingItem) return
    removePlace(trip.id, editingItem.id)
    resetPlaceForm()
    setOpenAddPlace(false)
  }

  const onEditItem = (item: TripItem) => {
    setEditingItem(item)
    setPlaceName(item.name)
    setPlaceTime(item.time || "")
    setPlaceCategory(item.category || "관광명소")
    setTransportKind((item.transportKind as TransportKind) || "bus")
    setPlaceMemo(item.memo || "")
    setAddress(item.address || "")
    setCoords({ lat: item.lat, lng: item.lng })
    setTargetDay(item.day || 1)
    setOpenAddPlace(true)
  }

  // ── 로딩 ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F6FF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-gray-400">불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#F0F6FF] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-base font-bold text-gray-700">여행을 찾을 수 없어요</p>
          <p className="text-sm text-gray-400 mt-1">이미 삭제된 여행일 수 있어요.</p>
        </div>
      </div>
    )
  }

  const normalizedPlaces: TripItem[] = (trip.places ?? []).map((p: any) => ({
    ...p, day: p.day, type: p.type ?? "place",
  }))

  const itemsByDay = (day: number) =>
    normalizedPlaces
      .filter((p) => (p.day ?? 1) === day)
      .sort((a, b) => (a.time || "").localeCompare(b.time || ""))

  const companionEmoji = trip.companions ? (COMPANION_EMOJI[trip.companions] ?? "👤") : null

  return (
    <div className="w-full min-h-screen bg-[#F0F6FF] pb-24">

      {/* ── Hero Header ── */}
      <div className="bg-primary px-5 pt-6 pb-8 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-10 -right-12 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.15)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-36 h-36 rounded-full bg-[radial-gradient(circle,rgba(255,211,64,.12)_0%,transparent_70%)]" />

        <div className="relative z-10 flex items-center justify-between mb-5">
          <button onClick={() => router.push("/trips")} className="flex items-center gap-1.5 text-white/80 text-sm font-semibold hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            내 여행
          </button>

          <div className="flex items-center gap-1">
            <button onClick={() => setOpenChecklist(true)} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors text-white text-xs font-bold px-3 py-2.5 rounded-xl backdrop-blur">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
              </svg>
              체크리스트
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0 rounded-xl bg-white/20 hover:bg-white/30 text-white border-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="p-1 min-w-[100px] bg-white rounded-xl shadow-xl border border-gray-100">
                <DropdownMenuItem onClick={() => setOpenEditTrip(true)} className="justify-center rounded-lg text-sm font-semibold text-gray-700">수정하기</DropdownMenuItem>
                <DropdownMenuItem className="justify-center rounded-lg text-sm font-semibold text-red-500 focus:text-red-500 border-t border-gray-100 mt-0.5" onClick={onDeleteTrip}>삭제하기</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="relative z-10">
          {trip.companions && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-base">{companionEmoji}</span>
              <span className="text-white/80 text-sm font-medium">{trip.companions} 함께하는</span>
            </div>
          )}
          <h1 className="text-[1.75rem] font-black text-white leading-tight tracking-tight mb-2">{displayTitle}</h1>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="flex items-center gap-1 text-white/85 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" />
              </svg>
              {displayDate}
            </span>
            {tripDays && <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur">{tripDays}</span>}
          </div>
          {trip.travelStyles && trip.travelStyles.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {trip.travelStyles.map((style: string, idx: number) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-white text-gray-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                  {STYLE_EMOJI[style] ?? "✈️"} {style}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="relative z-10 mt-5 grid grid-cols-2 gap-2.5">
          <div className="bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-4 py-3">
            <p className="text-white/70 text-[10px] font-semibold mb-0.5">총 일정</p>
            <p className="text-white font-black text-lg">{days.length > 0 ? `${days.length}일` : "—"}</p>
          </div>
          <div className="bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-4 py-3">
            <p className="text-white/70 text-[10px] font-semibold mb-0.5">등록 장소</p>
            <p className="text-white font-black text-lg">{totalPlaces > 0 ? `${totalPlaces}곳` : "—"}</p>
          </div>
        </div>
      </div>

      {/* ── Day Sections ── */}
      <div className="px-4 pt-5 space-y-4">
        {days.length > 0 ? (
          days.map((dayInfo) => {
            const dayItems   = itemsByDay(dayInfo.day)
            const distances  = calcDistances(dayItems)   // ✅ 거리 계산
            const isCurrentDay = targetDay === dayInfo.day && openAddPlace

            return (
              <div key={dayInfo.day}>
                <DaySection
                  day={dayInfo.day}
                  dateStr={dayInfo.dateStr}
                  items={dayItems}
                  distances={distances}          // ✅ DaySection → TimelineList로 전달
                  onItemClick={onEditItem}
                  onAddPlace={() => {
                    resetPlaceForm()
                    setTargetDay(dayInfo.day)
                    setOpenAddPlace(true)
                  }}
                />

                {isCurrentDay && (
                  <PlaceDialog
                    open={isCurrentDay}
                    onOpenChange={setOpenAddPlace}
                    editingItem={editingItem}
                    onSave={onAddPlace}
                    onDelete={onDeletePlace}
                    placeName={placeName}
                    onPlaceNameChange={setPlaceName}
                    placeTime={placeTime}
                    onPlaceTimeChange={setPlaceTime}
                    placeCategory={placeCategory}
                    onPlaceCategoryChange={setPlaceCategory}
                    transportKind={transportKind}
                    onTransportKindChange={setTransportKind}
                    placeMemo={placeMemo}
                    onPlaceMemoChange={setPlaceMemo}
                    address={address}
                    coords={coords}
                    onAddressChange={setAddress}
                    onCoordsChange={setCoords}
                    onReset={resetPlaceForm}
                  />
                )}
              </div>
            )
          })
        ) : (
          <div className="mt-12 flex flex-col items-center text-center px-6">
            <div className="w-16 h-16 bg-blue-50 rounded-[20px] flex items-center justify-center text-3xl mb-4">📅</div>
            <p className="text-base font-extrabold text-gray-700 mb-1.5">여행 날짜가 없어요</p>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">여행 정보 수정에서 날짜를 먼저 설정해 주세요.</p>
            <button onClick={() => setOpenEditTrip(true)} className="inline-flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-2xl shadow-[0_4px_14px_rgba(0,132,255,.35)] transition-transform hover:-translate-y-0.5 active:scale-[.97]">
              ✏️ 여행 정보 수정하기
            </button>
          </div>
        )}
      </div>

      <ChecklistDialog tripId={trip.id} open={openChecklist} onOpenChange={setOpenChecklist} />
      <TripEditDialog open={openEditTrip} onOpenChange={setOpenEditTrip} trip={trip} onSave={onSaveTrip} />
    </div>
  )
}