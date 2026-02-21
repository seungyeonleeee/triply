"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { useTripsStore } from "@/store/tripsStore"
import { Button } from "@/components/ui/button"
import { PlaceDialog } from "@/components/trips/PlaceDialog"
import { DaySection } from "@/components/trips/DaySection"
import { TripEditDialog } from "@/components/trips/TripEditDialog"
import type { TripItem } from "@/components/trips/TimelineList"

declare global {
  interface Window {
    daum?: any
    kakao?: any
  }
}

type Category = "관광명소" | "맛집" | "카페" | "쇼핑" | "숙소" | "교통"
type TransportKind = "flight" | "bus" | "taxi" | "subway" | "walk"
type TripItemType = "place" | "stay" | "memo" | "transport" | "flight"

interface PlaceLike {
  id: string
  name: string
  day: number
  type: TripItemType
  time?: string
  category: Category
  transportKind?: TransportKind
  address?: string
  lat?: number
  lng?: number
  memo?: string
}

// ============================================================================
// Script Loading
// ============================================================================

function loadScriptOnce(src: string, id: string) {
  if (typeof window === "undefined") return
  if (document.getElementById(id)) return
  const s = document.createElement("script")
  s.id = id
  s.src = src
  s.async = true
  document.head.appendChild(s)
}

// ============================================================================
// Geocoding
// ============================================================================

async function geocodeAddress(addr: string): Promise<{ lat: number; lng: number } | null> {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
  if (!key) return null

  await new Promise<void>((resolve) => {
    const tick = () => {
      if (window.kakao?.maps) return resolve()
      setTimeout(tick, 50)
    }
    tick()
  })

  await new Promise<void>((resolve) => {
    window.kakao.maps.load(() => resolve())
  })

  return await new Promise((resolve) => {
    try {
      const geocoder = new window.kakao.maps.services.Geocoder()
      geocoder.addressSearch(addr, (result: any[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK && result?.[0]) {
          resolve({ lat: Number(result[0].y), lng: Number(result[0].x) })
        } else {
          resolve(null)
        }
      })
    } catch {
      resolve(null)
    }
  })
}

async function ensureKakaoLoaded(): Promise<void> {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
  if (!key) throw new Error("NEXT_PUBLIC_KAKAO_JS_KEY missing")

  await new Promise<void>((resolve) => {
    const tick = () => {
      if (window.kakao?.maps) return resolve()
      setTimeout(tick, 50)
    }
    tick()
  })

  await new Promise<void>((resolve) => {
    window.kakao.maps.load(() => resolve())
  })
}

// ============================================================================
// Main Component
// ============================================================================

export default function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()

  const trip = useTripsStore((state) => state.trips.find((t: any) => t.id === tripId))
  const addPlace = useTripsStore((state) => state.addPlace)
  const updatePlace = useTripsStore((state) => state.updatePlace)
  const removePlace = useTripsStore((state) => state.removePlace)
  const editTrip = useTripsStore((state) => state.editTrip)

  // ========================================================================
  // Kakao Scripts
  // ========================================================================

  React.useEffect(() => {
    loadScriptOnce(
      "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js",
      "daum-postcode"
    )
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
    if (key) {
      loadScriptOnce(
        `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false&libraries=services`,
        "kakao-maps-sdk"
      )
    }
  }, [])

  // ========================================================================
  // Day Management
  // ========================================================================

  const generateDays = React.useCallback(() => {
    if (!trip?.startDate || !trip?.endDate) return []
    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)
    const days: { day: number; date: Date; dateStr: string }[] = []
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({
        day: days.length + 1,
        date: new Date(d),
        dateStr: `${d.getMonth() + 1}/${d.getDate()}`,
      })
    }
    return days
  }, [trip?.startDate, trip?.endDate])

  const days = generateDays()

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const displayTitle = trip?.title ? `${trip.title} 여행` : "제목 없는 여행"
  const displayDate = trip?.startDate
    ? trip?.endDate
      ? `${formatDate(trip.startDate)} ~ ${formatDate(trip.endDate)}`
      : `${formatDate(trip.startDate)}`
    : "미정"

  // ========================================================================
  // Edit Trip Handler
  // ========================================================================
  const [openEditTrip, setOpenEditTrip] = React.useState(false)

  const onSaveTrip = (data: Partial<TripItem>) => {
    if (!trip) return
    editTrip(trip.id, data)
  }

  // ========================================================================
  // Place Dialog Form State
  // ========================================================================

  const [openAddPlace, setOpenAddPlace] = React.useState(false)
  const [targetDay, setTargetDay] = React.useState<number>(1)

  const [placeName, setPlaceName] = React.useState("")
  const [placeTime, setPlaceTime] = React.useState("")
  const [placeCategory, setPlaceCategory] = React.useState<Category>("관광명소")
  const [transportKind, setTransportKind] = React.useState<TransportKind>("bus")
  const [placeMemo, setPlaceMemo] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [coords, setCoords] = React.useState<{ lat?: number; lng?: number }>({})
  const [editingItem, setEditingItem] = React.useState<TripItem | null>(null)

  const resetPlaceForm = () => {
    setPlaceName("")
    setPlaceTime("")
    setPlaceCategory("관광명소")
    setTransportKind("bus")
    setPlaceMemo("")
    setAddress("")
    setCoords({})
    setEditingItem(null)
  }

  // ========================================================================
  // Place Dialog Handlers
  // ========================================================================

  const openPostcode = React.useCallback(async () => {
    if (!window.daum?.Postcode) {
      alert("주소 검색 로딩 중… 잠깐만!")
      return
    }

    new window.daum.Postcode({
      oncomplete: async (data: any) => {
        const addr = data?.roadAddress || data?.jibunAddress || data?.address || ""
        setAddress(addr)

        try {
          await ensureKakaoLoaded()
          const geocoder = new window.kakao.maps.services.Geocoder()
          geocoder.addressSearch(addr, (result: any[], status: string) => {
            if (status === window.kakao.maps.services.Status.OK && result?.[0]) {
              const x = Number(result[0].x)
              const y = Number(result[0].y)
              setCoords({ lat: y, lng: x })
            } else {
              setCoords({})
            }
          })
        } catch {
          setCoords({})
        }
      },
    }).open()
  }, [])

  const onAddPlace = async () => {
    if (!trip) return

    let lat = coords.lat
    let lng = coords.lng

    if (lat == null || lng == null) {
      const r = await geocodeAddress(address)
      if (r) {
        lat = r.lat
        lng = r.lng
        setCoords(r)
      }
    }

    const isTransport = placeCategory === "교통"
    const isFlight = isTransport && transportKind === "flight"
    const type: TripItemType =
      isFlight ? "flight" : isTransport ? "transport" : placeCategory === "숙소" ? "stay" : "place"

    const payload: PlaceLike = {
      id: editingItem?.id || crypto.randomUUID(),
      name:
        placeName.trim() ||
        address
          .split(" ")
          .slice(0, 4)
          .join(" "),
      day: targetDay,
      type,
      time: placeTime.trim() || undefined,
      category: placeCategory,
      transportKind: isTransport ? transportKind : undefined,
      memo: placeMemo.trim() || undefined,
      address,
      lat,
      lng,
    }

    if (editingItem) {
      updatePlace(trip.id, editingItem.id, payload)
    } else {
      addPlace(trip.id, payload)
    }

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
    setTransportKind(item.transportKind || "bus")
    setPlaceMemo(item.memo || "")
    setAddress(item.address || "")
    setCoords({ lat: item.lat, lng: item.lng })
    setTargetDay(item.day || 1)
    setOpenAddPlace(true)
  }



  // ========================================================================
  // Render
  // ========================================================================

  if (!trip) {
    return <div className="p-4 text-sm">여행을 찾을 수 없어요.</div>
  }

  const normalizedPlaces: TripItem[] = (trip.places ?? []).map((p: any) => ({
    ...p,
    day: p.day,
    type: p.type ?? "place",
  }))

  const itemsByDay = (day: number) =>
    normalizedPlaces
      .filter((p) => (p.day ?? 1) === day)
      .sort((a, b) => (a.time || "").localeCompare(b.time || ""))


  console.log("trip", trip)

  return (
    <div className="size-full min-h-screen bg-neutral-50 p-4 space-y-6 pb-20 pt-8">
      {/* Header */}
      <div className="space-y-3 border-b border-neutral-200 pb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {trip.companions && <span className="text-sm">{trip.companions} 함께하는</span>}

            <h1 className="text-2xl font-extrabold text-neutral-900">{displayTitle}</h1>
            <p className="text-sm text-neutral-500 my-1.5">{displayDate}</p>

            {trip.travelStyles && trip.travelStyles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {trip.travelStyles.map((style: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold"
                  >
                    {style}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm" className="p-2" onClick={() => setOpenEditTrip(true)}>
            ✏️
          </Button>
          {trip && (
          <TripEditDialog
            open={openEditTrip}
            onOpenChange={setOpenEditTrip}
            trip={trip}
            onSave={onSaveTrip}
          />
        )}
        </div>
      </div>

      {/* Day Sections */}
      <div className="space-y-6">
        {days.length > 0 ? (
          days.map((dayInfo) => {
            const dayItems = itemsByDay(dayInfo.day)
            const isCurrentDay = targetDay === dayInfo.day && openAddPlace

            return (
              <div key={dayInfo.day}>
                <DaySection
                  day={dayInfo.day}
                  dateStr={dayInfo.dateStr}
                  items={dayItems}
                  onItemClick={onEditItem}
                  onAddPlace={() => {
                    resetPlaceForm()
                    setTargetDay(dayInfo.day)
                    setOpenAddPlace(true)
                  }}
                />

                {/* Dialog only shows for the current day */}
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
                    onOpenPostcode={openPostcode}
                    onReset={resetPlaceForm}
                  />
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>여행 날짜를 선택하면 일정을 계획할 수 있어요.</p>
          </div>
        )}
      </div>
    </div>
  )
}
