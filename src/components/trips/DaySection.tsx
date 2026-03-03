"use client"

import * as React from "react"
import { TimelineList } from "./TimelineList"
import type { TripItem } from "./TimelineList"

interface DaySectionProps {
  day: number
  dateStr: string
  items: TripItem[]
  distances?: (number | null)[]   // ← 거리 배열 추가
  onItemClick: (item: TripItem) => void
  onAddPlace: () => void
}

export function DaySection({ day, dateStr, items, distances, onItemClick, onAddPlace }: DaySectionProps) {
  return (
    <div className="rounded-[20px] bg-white border border-gray-100 shadow-sm overflow-hidden">

      {/* ── Day Header ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-primary text-[11px] font-bold px-3 py-1 rounded-full">
          📅 Day {day} · {dateStr}
        </span>
        <button
          onClick={onAddPlace}
          className="flex items-center gap-1 text-[12px] font-bold text-primary hover:bg-blue-50 px-2.5 py-1.5 rounded-xl transition-colors"
        >
          <span className="text-[15px] leading-none font-light">+</span>
          장소 추가
        </button>
      </div>

      {/* ── Timeline ── */}
      <div className="p-3.5">
        {/* distances를 TimelineList로 전달 */}
        <TimelineList items={items} onItemClick={onItemClick} distances={distances} />

        {items.length === 0 && (
          <div className="py-5 flex flex-col items-center">
            <p className="text-[12px] text-gray-400 font-medium">아직 일정이 없어요</p>
          </div>
        )}

        <button
          onClick={onAddPlace}
          className="mt-2 w-full border-2 border-dashed border-gray-200 rounded-2xl py-2.5 text-[12px] font-semibold text-gray-400 flex items-center justify-center gap-1.5 hover:border-primary/40 hover:text-primary transition-colors"
        >
          ＋ Google Maps에서 장소 추가
        </button>
      </div>
    </div>
  )
}