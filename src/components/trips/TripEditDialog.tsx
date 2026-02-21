"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Trip } from "@/types/trip"
import { TRAVEL_STYLES } from "@/constants/trip"

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  trip: Trip
  onSave: (data: Partial<Trip>) => void
}

export function TripEditDialog({ open, onOpenChange, trip, onSave }: Props) {
  const [title, setTitle] = React.useState(trip.title || "")
  const [startDate, setStartDate] = React.useState(trip.startDate || "")
  const [endDate, setEndDate] = React.useState(trip.endDate || "")
  const [companions, setCompanions] = React.useState(trip.companions || "")
  const [travelStyles, setTravelStyles] = React.useState(trip.travelStyles || [])

  React.useEffect(() => {
    if (open) {
      setTitle(trip.title || "")
      setStartDate(trip.startDate || "")
      setEndDate(trip.endDate || "")
      setCompanions(trip.companions || "")
      setTravelStyles(trip.travelStyles || [])
    }
  }, [open, trip])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>여행 정보 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="여행 제목" />

          <div className="flex gap-2">
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <Input
            value={companions}
            onChange={(e) => setCompanions(e.target.value)}
            placeholder="동행 (예: 친구, 가족)"
          />

          <div className="flex flex-wrap gap-2 mb-6">
            {TRAVEL_STYLES.map((style) => (
              <button
                key={style}
                onClick={() => {
                  if (travelStyles.includes(style)) {
                    setTravelStyles(travelStyles.filter((s) => s !== style))
                  } else {
                    setTravelStyles([...travelStyles, style])
                  }
                }}
                className={`px-3 py-1 rounded-full text-xs ${
                  travelStyles.includes(style)
                    ? "bg-blue-100 text-blue-700 border border-blue-100"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          <Button
            className="w-full"
            onClick={() => {
              onSave({ title, startDate, endDate, companions, travelStyles })
              onOpenChange(false)
            }}
          >
            저장하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

