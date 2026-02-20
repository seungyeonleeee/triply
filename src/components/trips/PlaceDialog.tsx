"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ItemType = "place" | "stay" | "memo" | "transport" | "flight"

type Category = "관광명소" | "맛집" | "카페" | "쇼핑" | "숙소" | "교통"
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
  onOpenPostcode: () => void
  onReset: () => void
  dayTrigger?: React.ReactNode
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
        checked ? "border-neutral-900 bg-white text-neutral-900" : "border-neutral-200 bg-white text-neutral-500",
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
  onOpenPostcode,
  onReset,
  dayTrigger,
}: PlaceDialogProps) {
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onReset()
    }
    onOpenChange(newOpen)
  }

  return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {dayTrigger && <DialogTrigger asChild>{dayTrigger}</DialogTrigger>}

        <DialogContent className="sm:max-w-md rounded-2xl overflow-y-scroll max-h-[80%]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "장소 수정" : "장소 추가"}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="mb-2 text-xs font-bold text-neutral-700">시간</div>
                <Input
                  placeholder="예: 10:30"
                  value={placeTime}
                  onChange={(e) => onPlaceTimeChange(e.target.value)}
                  type="time"
                  step="1800"
                  required
                />
              </div>

              <div>
                <div className="mb-2 text-xs font-bold text-neutral-700">카테고리</div>
                <select
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                  value={placeCategory}
                  onChange={(e) => onPlaceCategoryChange(e.target.value as Category)}
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
                  <Radio
                    checked={transportKind === "flight"}
                    onChange={() => onTransportKindChange("flight")}
                    label="항공권"
                  />
                  <Radio
                    checked={transportKind === "bus"}
                    onChange={() => onTransportKindChange("bus")}
                    label="버스"
                  />
                  <Radio
                    checked={transportKind === "taxi"}
                    onChange={() => onTransportKindChange("taxi")}
                    label="택시"
                  />
                  <Radio
                    checked={transportKind === "subway"}
                    onChange={() => onTransportKindChange("subway")}
                    label="지하철"
                  />
                  <Radio
                    checked={transportKind === "walk"}
                    onChange={() => onTransportKindChange("walk")}
                    label="도보"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="mb-2 text-xs font-bold text-neutral-700">장소명(선택)</div>
              <Input
                placeholder="예: 가든스 바이 더 베이 (비워도 됨)"
                value={placeName}
                onChange={(e) => onPlaceNameChange(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-2 text-xs font-bold text-neutral-700">
                실제 장소(주소) 등록
              </div>
              <div className="flex gap-2">
                <Input value={address} readOnly placeholder="주소 검색으로 선택" />
                <Button type="button" onClick={onOpenPostcode} className="rounded-xl">
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
                onChange={(e) => onPlaceMemoChange(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {editingItem ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={onDelete}
                >
                  삭제
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={() => {
                    onReset()
                    onOpenChange(false)
                  }}
                >
                  취소
                </Button>
              )}

              <Button
                type="button"
                className="w-full rounded-xl"
                onClick={onSave}
              >
                {editingItem ? "수정" : "저장"}
              </Button>
            </div>
          </div>
        </DialogContent>
    </Dialog>
  )
}
