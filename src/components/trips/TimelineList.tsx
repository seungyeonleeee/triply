"use client"

import * as React from "react"

export type TripItemType = "place" | "stay" | "memo" | "transport" | "flight"

export type TripItem = {
  id: string
  name: string
  day?: number
  type?: TripItemType
  time?: string
  category?: string
  transportKind?: string
  address?: string
  lat?: number
  lng?: number
  memo?: string
}

interface TimelineListProps {
  items: TripItem[]
  onItemClick: (item: TripItem) => void
}

// ── 카테고리 → 이모지 + 배경색 ─────────────────────────────────────────────
const CATEGORY_STYLE: Record<string, { icon: string; bg: string }> = {
  관광명소: { icon: "🗺️", bg: "bg-blue-50" },
  맛집:     { icon: "🍽️", bg: "bg-orange-50" },
  카페:     { icon: "☕",  bg: "bg-amber-50" },
  쇼핑:     { icon: "🛍️", bg: "bg-pink-50" },
  숙소:     { icon: "🏨", bg: "bg-purple-50" },
  교통:     { icon: "🚌", bg: "bg-gray-100" },
}

const TRANSPORT_STYLE: Record<string, { icon: string; bg: string }> = {
  flight: { icon: "✈️", bg: "bg-sky-50" },
  bus:    { icon: "🚌", bg: "bg-gray-100" },
  taxi:   { icon: "🚕", bg: "bg-yellow-50" },
  subway: { icon: "🚇", bg: "bg-blue-50" },
  walk:   { icon: "🚶", bg: "bg-green-50" },
}

const DEFAULT_STYLE = { icon: "📍", bg: "bg-blue-50" }

// ── 거리 표시용 더미 (실제 거리 데이터 있으면 item.distance로 교체) ──────────
function getStyle(item: TripItem) {
  const isTransport = item.type === "transport" || item.type === "flight"
  if (isTransport) {
    return TRANSPORT_STYLE[item.transportKind ?? "bus"] ?? DEFAULT_STYLE
  }
  return CATEGORY_STYLE[item.category ?? ""] ?? DEFAULT_STYLE
}

// ── 카테고리 레이블 ───────────────────────────────────────────────────────
function getCategoryLabel(item: TripItem) {
  if (item.type === "transport" || item.type === "flight") {
    const labels: Record<string, string> = {
      flight: "비행기", bus: "버스", taxi: "택시", subway: "지하철", walk: "도보",
    }
    return labels[item.transportKind ?? "bus"] ?? "이동"
  }
  return item.category ?? ""
}

export function TimelineList({ items, onItemClick }: TimelineListProps) {
  if (items.length === 0) return null

  return (
    <div className="flex flex-col gap-0">
      {items.map((item, index) => {
        const { icon, bg } = getStyle(item)
        const categoryLabel = getCategoryLabel(item)
        const isLast = index === items.length - 1

        return (
          <React.Fragment key={item.id}>
            {/* ── Place Card ── */}
            <div
              className="flex items-center gap-2.5 bg-white rounded-2xl px-3 py-2.5 border border-gray-100 shadow-sm cursor-pointer active:scale-[.98] transition-transform hover:border-primary/20 hover:shadow-md"
              onClick={() => onItemClick(item)}
            >
              {/* 아이콘 */}
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center text-lg shrink-0`}>
                {icon}
              </div>

              {/* 텍스트 */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-gray-800 truncate">{item.name}</p>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">
                  {item.time && <span className="font-mono mr-1.5">{item.time}</span>}
                  {categoryLabel}
                  {item.memo && <span className="ml-1.5">· 메모 있음 📝</span>}
                </p>
              </div>

              {/* 화살표 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-3.5 h-3.5 text-gray-300 shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </div>

            {/* ── 이동 거리 연결선 (마지막 항목 제외) ── */}
            {!isLast && (
              <div className="flex items-center gap-2 px-4 py-1">
                <div className="flex flex-col items-center gap-[3px]">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-[2px] h-[4px] bg-gray-200 rounded-full" />
                  ))}
                </div>
                {/* 거리 정보가 있으면 여기에 표시 */}
                {/* <span className="text-[10px] font-bold text-primary bg-blue-50 px-2 py-0.5 rounded-full">1.2km</span> */}
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}