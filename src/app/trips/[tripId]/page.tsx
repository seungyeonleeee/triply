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
  interface Window {
    google?: any
  }
}

async function geocodeAddress(
  addr: string
): Promise<{ lat: number; lng: number } | null> {
  await loadGoogleMaps()
  if (!window.google?.maps) return null

  return new Promise((resolve) => {
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: addr }, (results: any, status: string) => {
      if (status === "OK" && results?.[0]) {
        const location = results[0].geometry.location
        resolve({ lat: location.lat(), lng: location.lng() })
      } else {
        resolve(null)
      }
    })
  })
}

export default function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const router = useRouter()

  const trip = useTripsStore((state) => state.trips.find((t: any) => t.id === tripId))
  const addPlace = useTripsStore((state) => state.addPlace)
  const updatePlace = useTripsStore((state) => state.updatePlace)
  const removePlace = useTripsStore((state) => state.removePlace)
  const removeTrip = useTripsStore((state) => state.deleteTrip)
  const editTrip = useTripsStore((state) => state.updateTrip)

  const [loading, setLoading] = React.useState(true)
  const fetchTripDetail = useTripsStore((s) => s.fetchTripDetail)

  React.useEffect(() => {
    if (!tripId) return

    setLoading(true)
    fetchTripDetail(tripId).finally(() => setLoading(false))
  }, [tripId, fetchTripDetail])

  React.useEffect(() => {
    loadGoogleMaps().catch((error) => {
      console.error("Google Maps preload failed in TripDetailPage", error)
    })
  }, [])

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

  const displayTitle = trip?.title ? `${trip.title} 여행` : "여행 제목"
  const displayDate = trip?.startDate
    ? trip?.endDate
      ? `${formatDate(trip.startDate)} ~ ${formatDate(trip.endDate)}`
      : `${formatDate(trip.startDate)}`
    : "날짜 미정"

  const [openEditTrip, setOpenEditTrip] = React.useState(false)

  const onSaveTrip = (data: Partial<TripItem>) => {
    if (!trip) return
    editTrip(trip.id, data)
  }

  const onDeleteTrip = () => {
    if (!trip) return
    removeTrip(trip.id)
    router.push("/trips")
  }

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
  const [openChecklist, setOpenChecklist] = React.useState(false)



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

  const onAddPlace = async () => {
     console.log("🔥 onAddPlace called")
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
    const isStay = placeCategory === "숙소"
    const isFlight = isTransport && transportKind === "flight"
    const type: TripItemType =
      isFlight ? "flight" : isTransport ? "transport" : isStay ? "stay" : "place"

    const payload: Place = {
      id: editingItem?.id || crypto.randomUUID(),
      name: placeName.trim() || address.split(" ").slice(0, 4).join(" "),
      day: targetDay,
      type,
      time: placeTime.trim() || undefined,
      category: placeCategory,
      transportKind: isTransport ? transportKind : undefined,
      memo: placeMemo.trim() || undefined,
      address: address || "",
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

  if (loading) {
    return <div className="p-4 text-sm">불러오는 중...</div>
  }

  if (!trip) {
    return <div className="p-4 text-sm">여행을 찾을 수 없습니다.</div>
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

  return (
    <div className="size-full min-h-screen bg-neutral-50 p-4 space-y-6 pb-20 pt-6">
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
                    className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold"
                  >
                    {style}
                  </span>
                ))}
              </div>
            )}
          <Button variant="outline" onClick={() => setOpenChecklist(true)} className="gap-1 text-xs bg-gray-50 text-gray-800 px-2 py-1 rounded-full font-semibold h-auto mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
            </svg>
            체크리스트
          </Button>
          <ChecklistDialog
            tripId={trip.id}
            open={openChecklist}
            onOpenChange={setOpenChecklist}
          />
          
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="has-[>svg]:px-0 border-0 text-2xl text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>

              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-1 min-w-20 bg-white">
              <DropdownMenuItem onClick={() => setOpenEditTrip(true)} className="justify-center">
                수정하기
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-600 border-t justify-center" onClick={onDeleteTrip}>
                삭제하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TripEditDialog
            open={openEditTrip}
            onOpenChange={setOpenEditTrip}
            trip={trip}
            onSave={onSaveTrip}
          />
        </div>
      </div>

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
          <div className="text-center py-8 text-muted-foreground">
            <p>여행 날짜가 없어요. 여행 정보 수정에서 날짜를 먼저 설정해 주세요.</p>
          </div>
        )}
      </div>
    </div>
  )
}
