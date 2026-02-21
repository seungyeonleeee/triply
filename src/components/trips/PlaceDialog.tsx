"use client"

import * as React from "react"
import usePlacesAutocomplete from "@/hooks/usePlacesAutocomplete"
import MapPreview from "@/components/maps/MapPreview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Category = string
type TransportKind = "flight" | "bus" | "taxi" | "subway" | "walk"
type TripItemType = "place" | "stay" | "memo" | "transport" | "flight"

type TripItem = {
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

interface PlaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: TripItem | null
  onSave: () => void | Promise<void>
  onDelete: () => void
  placeName: string
  onPlaceNameChange: (value: string) => void
  placeTime: string
  onPlaceTimeChange: (value: string) => void
  placeCategory: Category
  onPlaceCategoryChange: (value: Category) => void
  transportKind: TransportKind
  onTransportKindChange: (value: TransportKind) => void
  placeMemo: string
  onPlaceMemoChange: (value: string) => void
  address: string
  coords: { lat?: number; lng?: number }
  onAddressChange: (v: string) => void
  onCoordsChange: (v: { lat?: number; lng?: number }) => void
  onReset: () => void
  dayTrigger?: React.ReactNode
}

const categories: Array<{ value: Category; label: string }> = [
  { value: "관광명소", label: "관광명소" },
  { value: "맛집", label: "맛집" },
  { value: "카페", label: "카페" },
  { value: "쇼핑", label: "쇼핑" },
  { value: "숙소", label: "숙소" },
  { value: "교통", label: "교통" },
]

const transportCategory = "교통" as Category

const transportOptions: Array<{ value: TransportKind; label: string; icon: string }> = [
  { value: "flight", label: "비행기", icon: "✈️" },
  { value: "bus", label: "버스", icon: "🚌" },
  { value: "taxi", label: "택시", icon: "🚕" },
  { value: "subway", label: "지하철", icon: "🚇" },
  { value: "walk", label: "도보", icon: "🚶" },
]

export function PlaceDialog({
  open,
  onOpenChange,
  editingItem,
  onSave,
  onDelete,
  placeName,
  onPlaceNameChange,
  placeTime,
  onPlaceTimeChange,
  placeCategory,
  onPlaceCategoryChange,
  transportKind,
  onTransportKindChange,
  placeMemo,
  onPlaceMemoChange,
  address,
  coords,
  onAddressChange,
  onCoordsChange,
  onReset,
  dayTrigger,
}: PlaceDialogProps) {
  const { inputRef } = usePlacesAutocomplete((place) => {
    onAddressChange(place.address)
    onCoordsChange({ lat: place.lat, lng: place.lng })
  })

  const isTransport = placeCategory === transportCategory

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) onReset()
    onOpenChange(newOpen)
  }

  const isPacContainerClick = (target: EventTarget | null) => {
    const el = target as HTMLElement | null
    if (!el) return false
    return !!el.closest(".pac-container")
  }

  const shouldKeepDialogOpenForPac = (event: any) => {
    const directTarget = event?.target as EventTarget | null
    const originalTarget = event?.detail?.originalEvent?.target as EventTarget | null
    return isPacContainerClick(directTarget) || isPacContainerClick(originalTarget)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
      {dayTrigger && <DialogTrigger asChild>{dayTrigger}</DialogTrigger>}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/30"
          onClick={() => handleOpenChange(false)}
        />
      )}

      <DialogContent
        className="sm:max-w-md rounded-2xl overflow-y-scroll scrollbar-thin max-h-[80%]"
        onPointerDownOutside={(event) => {
          if (shouldKeepDialogOpenForPac(event)) event.preventDefault()
        }}
        onInteractOutside={(event) => {
          if (shouldKeepDialogOpenForPac(event)) event.preventDefault()
        }}
        onFocusOutside={(event) => {
          if (shouldKeepDialogOpenForPac(event)) event.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>{editingItem ? "장소 수정" : "장소 추가"}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>시간</Label>
            <Input
              value={placeTime}
              onChange={(e) => onPlaceTimeChange(e.target.value)}
              type="time"
              step="1800"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>카테고리</Label>
            <Select
              value={placeCategory}
              onValueChange={(value) => onPlaceCategoryChange(value as Category)}
            >
              <SelectTrigger className="bg-white w-full">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value} className="not-last:border-b">
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isTransport && (
            <div className="space-y-2">
              <Label>이동수단</Label>
              <RadioGroup
                value={transportKind}
                onValueChange={(value) => onTransportKindChange(value as TransportKind)}
                className="grid grid-cols-2 gap-3"
              >
                {transportOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm"
                  >
                    <RadioGroupItem value={option.value} id={`transport-${option.value}`} />
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label>장소명</Label>
            <Input
              value={placeName}
              onChange={(e) => onPlaceNameChange(e.target.value)}
              placeholder="직접 입력"
            />
          </div>

          <div className="space-y-2">
            <Label>주소 검색</Label>
            <Input
              ref={inputRef}
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="주소를 검색하세요"
            />

            {coords.lat && coords.lng && (
              <div className="mt-3">
                <MapPreview lat={coords.lat} lng={coords.lng} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>메모</Label>
            <Textarea
              className="min-h-22.5 resize-none"
              value={placeMemo}
              onChange={(e) => onPlaceMemoChange(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {editingItem ? (
              <Button variant="outline" onClick={onDelete}>
                삭제
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  onReset()
                  onOpenChange(false)
                }}
              >
                취소
              </Button>
            )}

            <Button onClick={onSave}>{editingItem ? "수정" : "추가"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
