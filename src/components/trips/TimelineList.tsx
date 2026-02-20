"use client"

import * as React from "react"

type TripItemType = "place" | "stay" | "memo" | "transport" | "flight"
type TransportKind = "flight" | "bus" | "taxi" | "subway" | "walk"
type Category = "관광명소" | "맛집" | "카페" | "쇼핑" | "숙소" | "교통"

export type TripItem = {
  id: string
  name: string
  day?: number
  type?: TripItemType
  time?: string
  category?: Category
  transportKind?: TransportKind
  address?: string
  lat?: number
  lng?: number
  memo?: string
}

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
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

export function formatDistance(km: number) {
  if (!Number.isFinite(km)) return ""
  if (km < 1) return `${Math.round(km * 1000)}m`
  return `${km.toFixed(km < 10 ? 1 : 0)}km`
}

export function transportLabel(kind?: TransportKind) {
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

export function transportIcon(kind?: TransportKind) {
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
  item,
  badge,
  tagText,
  onClick,
}: {
  item: TripItem
  badge: React.ReactNode
  tagText: string
  onClick?: () => void
}) {
  return (
    <div className="relative flex gap-3 cursor-pointer" onClick={onClick}>
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
      <div className="w-full rounded-3xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow">
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
                <div className="mt-2 rounded-2xl bg-neutral-50 text-xs font-semibold text-neutral-600">
                  “{item.memo}”
                </div>
              ) : null}
            </div>

            <MiniPill text={tagText} />
          </div>
        </div>
      </div>
    </div>
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

export interface TimelineListProps {
  items: TripItem[]
  onItemClick?: (item: TripItem) => void
}

export function TimelineList({ items, onItemClick }: TimelineListProps) {
  // ✅ 숫자 배지: memo 제외, flight 제외, transport는 아이콘 배지 사용
  const numberMap = React.useMemo(() => {
    const map = new Map<string, number>()
    let n = 1
    for (const it of items) {
      const type = it.type ?? "place"
      if (type === "memo") continue
      if (type === "flight") continue
      if (type === "transport") continue // 교통은 아이콘 배지
      map.set(it.id, n++)
    }
    return map
  }, [items])

  // ✅ 거리 표기: memo 끼면 스킵, 좌표 없으면 스킵
  const rows = React.useMemo(() => {
    const out: Array<{ kind: "item"; item: TripItem } | { kind: "gap"; id: string; text: string }> = []
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
      {/* vertical guide */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 h-5/6 w-px bg-neutral-200" />

      {rows.map((row) => {
        if (row.kind === "gap") return <DistanceRow key={row.id} text={row.text} />
        const it = row.item
        const type = it.type ?? "place"
        const n = numberMap.get(it.id)

        return (
          <TimelineCard
            key={it.id}
            item={it}
            badge={
              type === "flight" ? (
                <IconBadge icon={transportIcon("flight")} />
              ) : type === "transport" ? (
                <IconBadge icon={transportIcon(it.transportKind)} />
              ) : type === "memo" ? (
                <MiniBadge text="메모" />
              ) : (
                <NumberBadge n={n ?? 0} />
              )
            }
            tagText={
              type === "stay"
                ? "숙소"
                : type === "flight"
                ? "항공"
                : type === "transport"
                ? transportLabel(it.transportKind)
                : it.category ?? "장소"
            }
            onClick={() => onItemClick?.(it)}
          />
        )
      })}
    </div>
  )
}
