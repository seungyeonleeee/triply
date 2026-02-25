"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { TimelineList, type TripItem } from "./TimelineList"

export interface DaySectionProps {
  day: number
  dateStr: string
  items: TripItem[]
  onItemClick: (item: TripItem) => void
  onAddPlace: () => void
}

export function DaySection({
  day,
  dateStr,
  items,
  onItemClick,
  onAddPlace,
}: DaySectionProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-extrabold text-neutral-900">
        Day {day}{" "}
        <span className="text-neutral-400 font-semibold text-sm ml-1">{dateStr}</span>
      </h2>

      {/* Timeline list */}
      <TimelineList
        items={items}
        onItemClick={onItemClick}
      />

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="rounded-2xl gap-1"
          onClick={onAddPlace}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>

          
          장소 추가
        </Button>
      </div>
    </div>
  )
}
