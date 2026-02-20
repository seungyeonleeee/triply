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
        <span className="text-neutral-400 font-semibold">{dateStr}</span>
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
          className="rounded-2xl"
          onClick={onAddPlace}
        >
          + 장소 추가
        </Button>
      </div>
    </div>
  )
}
