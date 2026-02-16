"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { useTripsStore } from "@/store/tripsStore"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// ------- types (store Place 타입이 어떤지 몰라 확장 필드는 optional로 둠) -------
type Category = "관광명소" | "맛집" | "카페" | "쇼핑" | "숙소" | "교통"
type TransportKind = "flight" | "bus" | "taxi" | "subway" | "walk"
type ItemType = "place" | "stay" | "memo" | "transport" | "flight"

type PlaceLike = {
  id: string
  name: string
  memo?: string

  // 확장
  day?: number
  type?: ItemType
  time?: string
  category?: Category
  transportKind?: TransportKind
  address?: string
  lat?: number
  lng?: number
}

declare global {
  interface Window {
    daum?: any
    kakao?: any
  }
}

// ------- utils -------
function loadScriptOnce(src: string, id: string) {
  if (typeof window === "undefined") return
  if (document.getElementById(id)) return
  const s = document.createElement("script")
  s.id = id
  s.src = src
  s.async = true
  document.head.appendChild(s)
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (v: number) => (v * Math.PI) / 180
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

function formatDistance(km: number) {
  if (!Number.isFinite(km)) return ""
  if (km < 1) return `${Math.round(km * 1000)}m`
  return `${km.toFixed(km < 10 ? 1 : 0)}km`
}

function transportLabel(kind?: TransportKind) {
  switch (kind) {
    case "flight":
      return "항공"
    case "bus":
      return "버스"
    case "taxi":
      return "택시"
    case "subway":
      return "지하철"
    case "walk":
      return "도보"
    default:
      return "교통"
  }
}

function transportIcon(kind?: TransportKind) {
  switch (kind) {
    case "flight":
      return "✈️"
    case "bus":
      return "🚌"
    case "taxi":
      return "🚕"
    case "subway":
      return "🚇"
    case "walk":
      return "🚶"
    default:
      return "🧭"
  }
}

export default function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()

  const trip = useTripsStore((s: any) => s.trips.find((t: any) => t.id === tripId))
  const addPlace = useTripsStore((s) => s.addPlace) as any
  const updatePlace = useTripsStore((s) => s.updatePlace) as any
  const removePlace = useTripsStore((s) => s.removePlace) as any

  // scripts
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

  const ensureKakaoLoaded = React.useCallback(async () => {
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
  }, [])

  if (!trip) {
    return <div className="p-4 text-sm">여행을 찾을 수 없어요.</div>
  }

  // ---- header computations (기존 로직 유지) ----
  const firstPlace = trip.places.length > 0 ? trip.places[0].name : "미정"
  const displayTitle = `${firstPlace} 여행`

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const displayDate = trip.startDate
    ? trip.endDate
      ? `${formatDate(trip.startDate)} ~ ${formatDate(trip.endDate)}`
      : `${formatDate(trip.startDate)}`
    : "미정"

  const generateDays = () => {
    if (!trip.startDate || !trip.endDate) return []
    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)
    const days: { day: number; dateStr: string }[] = []

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({
        day: days.length + 1,
        dateStr: `${d.getMonth() + 1}/${d.getDate()}`,
      })
    }
    return days
  }

  const days = generateDays()

  // ---- normalize existing places (day/type 없으면 day1/place로 간주) ----
  const allItems: PlaceLike[] = (trip.places ?? []).map((p: any) => ({
    ...p,
    day: typeof p.day === "number" ? p.day : 1,
    type: p.type ?? "place",
  }))

  const itemsByDay = (day: number) => allItems.filter((p) => (p.day ?? 1) === day)

  // ---- add dialogs state ----
  const [targetDay, setTargetDay] = React.useState(1)

  const [openAddPlace, setOpenAddPlace] = React.useState(false)
  const [openAddMemo, setOpenAddMemo] = React.useState(false)

  // add place form
  const [placeName, setPlaceName] = React.useState("")
  const [placeTime, setPlaceTime] = React.useState("")
  const [placeCategory, setPlaceCategory] = React.useState<Category>("관광명소")
  const [transportKind, setTransportKind] = React.useState<TransportKind>("bus")
  const [placeMemo, setPlaceMemo] = React.useState("")

  const [address, setAddress] = React.useState("")
  const [coords, setCoords] = React.useState<{ lat?: number; lng?: number }>({})

  const resetPlaceForm = () => {
    setPlaceName("")
    setPlaceTime("")
    setPlaceCategory("관광명소")
    setTransportKind("bus")
    setPlaceMemo("")
    setAddress("")
    setCoords({})
  }

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
  }, [ensureKakaoLoaded])

  const onAddPlace = () => {
    if (!address.trim()) {
      alert("주소 검색으로 실제 장소(주소)를 먼저 선택해줘!")
      return
    }

    const isTransport = placeCategory === "교통"
    const isFlight = isTransport && transportKind === "flight"

    const type: ItemType =
      isFlight ? "flight" : isTransport ? "transport" : placeCategory === "숙소" ? "stay" : "place"

    const payload: PlaceLike = {
      id: crypto.randomUUID(),
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
      lat: coords.lat,
      lng: coords.lng,
    }

    addPlace(trip.id, payload)
    resetPlaceForm()
    setOpenAddPlace(false)
  }

  // add memo form
  const [memoText, setMemoText] = React.useState("")
  const [memoTime, setMemoTime] = React.useState("")

  const resetMemoForm = () => {
    setMemoText("")
    setMemoTime("")
  }

  const onAddMemo = () => {
    if (!memoText.trim()) return
    const payload: PlaceLike = {
      id: crypto.randomUUID(),
      name: memoText.trim(),
      day: targetDay,
      type: "memo",
      time: memoTime.trim() || undefined,
    }
    addPlace(trip.id, payload)
    resetMemoForm()
    setOpenAddMemo(false)
  }

  return (
    <div className="size-full min-h-screen bg-neutral-50 p-4 space-y-6 pb-24">
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

          <Button variant="ghost" size="sm" className="p-2">
            ✏️
          </Button>
        </div>
      </div>

      {/* Days */}
      <div className="space-y-7">
        {days.length > 0 ? (
          days.map((dayInfo) => {
            const dayItems = itemsByDay(dayInfo.day)

            return (
              <div key={dayInfo.day} className="space-y-3">
                <h2 className="text-lg font-extrabold text-neutral-900">
                  Day {dayInfo.day}{" "}
                  <span className="text-neutral-400 font-semibold">{dayInfo.dateStr}</span>
                </h2>

                {/* Timeline */}
                <TimelineList
                  tripId={trip.id}
                  items={dayItems}
                  updatePlace={updatePlace}
                  removePlace={removePlace}
                />

                {/* Actions */}
                <div className="flex gap-2">
                  {/* Add Place */}
                  <Dialog
                    open={openAddPlace && targetDay === dayInfo.day}
                    onOpenChange={(v) => {
                      if (!v) setOpenAddPlace(false)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-2xl"
                        onClick={() => {
                          setTargetDay(dayInfo.day)
                          setOpenAddPlace(true)
                        }}
                      >
                        + 장소 추가
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>장소 추가</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="mb-2 text-xs font-bold text-neutral-700">시간(선택)</div>
                            <Input
                              placeholder="예: 10:30"
                              value={placeTime}
                              onChange={(e) => setPlaceTime(e.target.value)}
                            />
                          </div>

                          <div>
                            <div className="mb-2 text-xs font-bold text-neutral-700">카테고리</div>
                            <select
                              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                              value={placeCategory}
                              onChange={(e) => setPlaceCategory(e.target.value as Category)}
                            >
                              <option value="관광명소">관광명소</option>
                              <option value="맛집">맛집</option>
                              <option value="카페">카페</option>
                              <option value="쇼핑">쇼핑</option>
                              <option value="숙소">숙소</option>
                              <option value="교통">교통</option>
                            </select>
                          </div>
                        </div>

                        {placeCategory === "교통" && (
                          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                            <div className="text-xs font-bold text-neutral-700 mb-2">교통 타입</div>
                            <div className="grid grid-cols-2 gap-2">
                              <Radio checked={transportKind === "flight"} onChange={() => setTransportKind("flight")} label="항공권" />
                              <Radio checked={transportKind === "bus"} onChange={() => setTransportKind("bus")} label="버스" />
                              <Radio checked={transportKind === "taxi"} onChange={() => setTransportKind("taxi")} label="택시" />
                              <Radio checked={transportKind === "subway"} onChange={() => setTransportKind("subway")} label="지하철" />
                              <Radio checked={transportKind === "walk"} onChange={() => setTransportKind("walk")} label="도보" />
                            </div>
                          </div>
                        )}

                        <div>
                          <div className="mb-2 text-xs font-bold text-neutral-700">장소명(선택)</div>
                          <Input
                            placeholder="예: 가든스 바이 더 베이 (비워도 됨)"
                            value={placeName}
                            onChange={(e) => setPlaceName(e.target.value)}
                          />
                        </div>

                        <div>
                          <div className="mb-2 text-xs font-bold text-neutral-700">실제 장소(주소) 등록</div>
                          <div className="flex gap-2">
                            <Input value={address} readOnly placeholder="주소 검색으로 선택" />
                            <Button type="button" onClick={openPostcode} className="rounded-xl">
                              주소검색
                            </Button>
                          </div>
                          <div className="mt-2 text-xs text-neutral-400">
                            {coords.lat && coords.lng
                              ? `좌표 확보됨 · (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)})`
                              : "좌표 변환 중이거나 실패할 수 있어."}
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 text-xs font-bold text-neutral-700">메모(선택)</div>
                          <textarea
                            className="min-h-[90px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                            placeholder="예: 예약함 / 꼭 야경 보기"
                            value={placeMemo}
                            onChange={(e) => setPlaceMemo(e.target.value)}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="w-full rounded-xl"
                            onClick={() => {
                              resetPlaceForm()
                              setOpenAddPlace(false)
                            }}
                          >
                            취소
                          </Button>
                          <Button className="w-full rounded-xl" onClick={onAddPlace}>
                            추가
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Add Memo */}
                  <Dialog
                    open={openAddMemo && targetDay === dayInfo.day}
                    onOpenChange={(v) => {
                      if (!v) setOpenAddMemo(false)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-2xl"
                        onClick={() => {
                          setTargetDay(dayInfo.day)
                          setOpenAddMemo(true)
                        }}
                      >
                        + 메모 추가
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>메모 추가</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div>
                          <div className="mb-2 text-xs font-bold text-neutral-700">시간(선택)</div>
                          <Input
                            placeholder="예: 22:10"
                            value={memoTime}
                            onChange={(e) => setMemoTime(e.target.value)}
                          />
                        </div>

                        <div>
                          <div className="mb-2 text-xs font-bold text-neutral-700">내용</div>
                          <textarea
                            className="min-h-[120px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                            placeholder="예: 공항 도착하면 유심 먼저 사기"
                            value={memoText}
                            onChange={(e) => setMemoText(e.target.value)}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="w-full rounded-xl"
                            onClick={() => {
                              resetMemoForm()
                              setOpenAddMemo(false)
                            }}
                          >
                            취소
                          </Button>
                          <Button className="w-full rounded-xl" onClick={onAddMemo}>
                            추가
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
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

// ---------- timeline components ----------
function TimelineList({
  tripId,
  items,
  updatePlace,
  removePlace,
}: {
  tripId: string
  items: PlaceLike[]
  updatePlace: (tripId: string, placeId: string, patch: Partial<PlaceLike>) => void
  removePlace: (tripId: string, placeId: string) => void
}) {
  // 숫자 배지: memo/flight/transport 제외, 나머지 1..n
  const numberMap = React.useMemo(() => {
    const map = new Map<string, number>()
    let n = 1
    for (const it of items) {
      const type = it.type ?? "place"
      if (type === "memo") continue
      if (type === "flight") continue
      if (type === "transport") continue
      map.set(it.id, n++)
    }
    return map
  }, [items])

  // 거리 row: memo 끼면 스킵, 좌표 없으면 스킵
  const rows = React.useMemo(() => {
    const out: Array<{ kind: "item"; item: PlaceLike } | { kind: "gap"; id: string; text: string }> = []
    for (let i = 0; i < items.length; i++) {
      const cur = items[i]
      out.push({ kind: "item", item: cur })
      const next = items[i + 1]
      if (!next) continue

      const curType = cur.type ?? "place"
      const nextType = next.type ?? "place"
      if (curType === "memo" || nextType === "memo") continue
      if (cur.lat == null || cur.lng == null || next.lat == null || next.lng == null) continue

      const km = haversineKm({ lat: cur.lat, lng: cur.lng }, { lat: next.lat, lng: next.lng })
      out.push({ kind: "gap", id: `${cur.id}__${next.id}`, text: formatDistance(km) })
    }
    return out
  }, [items])

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-400">
        아직 등록된 일정이 없어요.
      </div>
    )
  }

  return (
    <div className="relative space-y-3 pl-1">
      <div className="absolute left-[18px] top-3 h-[calc(100%-12px)] w-px bg-neutral-200" />

      {rows.map((row) => {
        if (row.kind === "gap") return <DistanceRow key={row.id} text={row.text} />

        const it = row.item
        const type = it.type ?? "place"
        const n = numberMap.get(it.id)

        const badge =
          type === "flight" ? (
            <IconBadge icon={transportIcon("flight")} />
          ) : type === "transport" ? (
            <IconBadge icon={transportIcon(it.transportKind)} />
          ) : type === "memo" ? (
            <MiniBadge text="M" />
          ) : (
            <NumberBadge n={n ?? 0} />
          )

        const tagText =
          type === "stay"
            ? "숙소"
            : type === "flight"
            ? "항공"
            : type === "transport"
            ? transportLabel(it.transportKind)
            : it.category ?? "장소"

        return (
          <TimelineCard
            key={it.id}
            tripId={tripId}
            item={it}
            badge={badge}
            tagText={tagText}
            updatePlace={updatePlace}
            removePlace={removePlace}
          />
        )
      })}
    </div>
  )
}

function DistanceRow({ text }: { text: string }) {
  return (
    <div className="relative flex items-center gap-3">
      <div className="w-12 shrink-0" />
      <div className="relative flex w-6 shrink-0 items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-neutral-200" />
      </div>
      <div className="flex-1">
        <div className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-500">
          {text}
        </div>
      </div>
    </div>
  )
}

function TimelineCard({
  tripId,
  item,
  badge,
  tagText,
  updatePlace,
  removePlace,
}: {
  tripId: string
  item: PlaceLike
  badge: React.ReactNode
  tagText: string
  updatePlace: (tripId: string, placeId: string, patch: Partial<PlaceLike>) => void
  removePlace: (tripId: string, placeId: string) => void
}) {
  const [memoDraft, setMemoDraft] = React.useState(item.memo ?? "")

  React.useEffect(() => {
    setMemoDraft(item.memo ?? "")
  }, [item.memo])

  const onSaveMemo = () => {
    updatePlace(tripId, item.id, { memo: memoDraft })
  }

  const onDelete = () => {
    removePlace(tripId, item.id)
  }

  return (
    <div className="relative flex gap-3">
      {/* time */}
      <div className="w-12 shrink-0 text-right">
        <div className="text-xs font-extrabold text-neutral-400 leading-5">
          {item.time ?? ""}
        </div>
      </div>

      {/* badge */}
      <div className="relative flex w-6 shrink-0 items-start justify-center">
        <div className="mt-[2px]">{badge}</div>
      </div>

      {/* card */}
      <div className="w-full rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-neutral-900 leading-5">
                {item.name}
              </div>

              {item.address ? (
                <div className="mt-1 text-xs font-semibold text-neutral-400 line-clamp-2">
                  {item.address}
                </div>
              ) : null}

              {item.memo ? (
                <div className="mt-2 rounded-2xl bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-600">
                  {item.memo}
                </div>
              ) : null}

              {/* actions: memo + delete (기존 PlaceCard 기능 유지) */}
              <div className="mt-3 flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="rounded-2xl">
                      메모
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>장소 메모</DialogTitle>
                    </DialogHeader>

                    <Input
                      placeholder="메모를 입력하세요"
                      value={memoDraft}
                      onChange={(e) => setMemoDraft(e.target.value)}
                    />

                    <Button className="rounded-xl" onClick={onSaveMemo}>
                      저장
                    </Button>
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-2xl text-destructive hover:text-destructive"
                  onClick={onDelete}
                >
                  삭제
                </Button>
              </div>
            </div>

            <MiniPill text={tagText} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Radio({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={[
        "flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold transition",
        checked
          ? "border-neutral-900 bg-white text-neutral-900"
          : "border-neutral-200 bg-white text-neutral-500",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={[
          "h-4 w-4 rounded-full border",
          checked ? "border-neutral-900 bg-neutral-900" : "border-neutral-300 bg-white",
        ].join(" ")}
      />
    </button>
  )
}

function MiniPill({ text }: { text: string }) {
  return (
    <div className="shrink-0 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-extrabold text-neutral-500">
      {text}
    </div>
  )
}

function MiniBadge({ text }: { text: string }) {
  return (
    <div className="grid h-6 w-6 place-items-center rounded-full bg-neutral-100 text-[10px] font-extrabold text-neutral-700 shadow-sm border border-neutral-200">
      {text}
    </div>
  )
}

function NumberBadge({ n }: { n: number }) {
  return (
    <div className="grid h-6 w-6 place-items-center rounded-full bg-neutral-900 text-[11px] font-extrabold text-white shadow-sm">
      {n || ""}
    </div>
  )
}

function IconBadge({ icon }: { icon: string }) {
  return (
    <div className="grid h-6 w-6 place-items-center rounded-full bg-neutral-100 text-[12px] shadow-sm border border-neutral-200">
      <span aria-hidden>{icon}</span>
    </div>
  )
}
