"use client"

import * as React from "react"
import usePlacesAutocomplete from "@/hooks/usePlacesAutocomplete"
import MapPreview from "@/components/maps/MapPreview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const categories: Array<{ value: Category; label: string; icon: string; bg: string }> = [
  { value: "관광명소", label: "관광명소", icon: "🗺️", bg: "bg-blue-50" },
  { value: "맛집",    label: "맛집",    icon: "🍽️", bg: "bg-orange-50" },
  { value: "카페",    label: "카페",    icon: "☕",  bg: "bg-amber-50" },
  { value: "쇼핑",   label: "쇼핑",    icon: "🛍️", bg: "bg-pink-50" },
  { value: "숙소",   label: "숙소",    icon: "🏨", bg: "bg-purple-50" },
  { value: "교통",   label: "교통",    icon: "🚌", bg: "bg-gray-100" },
]

const transportOptions: Array<{ value: TransportKind; label: string; icon: string }> = [
  { value: "flight", label: "비행기", icon: "✈️" },
  { value: "bus",    label: "버스",   icon: "🚌" },
  { value: "taxi",   label: "택시",   icon: "🚕" },
  { value: "subway", label: "지하철", icon: "🚇" },
  { value: "walk",   label: "도보",   icon: "🚶" },
]

// ── 공통 라벨 컴포넌트 ────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold text-gray-500 tracking-wide uppercase mb-1.5">
      {children}
    </p>
  )
}

// ── 공통 인풋 스타일 ─────────────────────────────────────────────────────
const inputCls =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"

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

  const isTransport = placeCategory === "교통"

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

  // 현재 선택된 카테고리 스타일
  const selectedCat = categories.find((c) => c.value === placeCategory)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
      {dayTrigger && <DialogTrigger asChild>{dayTrigger}</DialogTrigger>}

      {/* 백드롭 */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => handleOpenChange(false)}
        />
      )}

      <DialogContent
        className="z-50 sm:max-w-md rounded-3xl overflow-y-auto scrollbar-thin max-h-[88%] border-0 shadow-[0_24px_60px_rgba(0,0,0,.18)] p-0 md:gap-4"
        onPointerDownOutside={(e) => { if (shouldKeepDialogOpenForPac(e)) e.preventDefault() }}
        onInteractOutside={(e)    => { if (shouldKeepDialogOpenForPac(e)) e.preventDefault() }}
        onFocusOutside={(e)       => { if (shouldKeepDialogOpenForPac(e)) e.preventDefault() }}
      >
        {/* ── 상단 헤더 ── */}
        <DialogHeader className="px-5 pt-5 pb-0">
          <div className="flex items-center gap-3 mb-1">
            {/* 카테고리 아이콘 미리보기 */}
            <div className={`w-10 h-10 ${selectedCat?.bg ?? "bg-blue-50"} rounded-xl flex items-center justify-center text-xl shrink-0`}>
              {selectedCat?.icon ?? "📍"}
            </div>
            <DialogTitle className="text-[17px] font-black text-gray-900">
              {editingItem ? "장소 수정" : "장소 추가"}
            </DialogTitle>
          </div>
          {/* 구분선 */}
          <div className="mt-3 h-px bg-gray-100" />
        </DialogHeader>

        {/* ── 폼 본문 ── */}
        <div className="px-5 py-4 space-y-5">

          {/* 시간 */}
          <div>
            <FieldLabel>⏰ 시간</FieldLabel>
            <input
              type="time"
              value={placeTime}
              onChange={(e) => onPlaceTimeChange(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* 카테고리 — chip grid */}
          <div>
            <FieldLabel>🏷️ 카테고리</FieldLabel>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => {
                const isActive = placeCategory === cat.value
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => onPlaceCategoryChange(cat.value)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border-2 text-[12px] font-bold transition-all ${
                      isActive
                        ? "border-primary bg-blue-50 text-primary shadow-[0_0_0_1px_rgba(0,132,255,.2)]"
                        : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-base leading-none">{cat.icon}</span>
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 이동수단 — 교통 선택 시만 표시 */}
          {isTransport && (
            <div>
              <FieldLabel>🚦 이동수단</FieldLabel>
              <RadioGroup
                value={transportKind}
                onValueChange={(v) => onTransportKindChange(v as TransportKind)}
                className="grid grid-cols-2 gap-2"
              >
                {transportOptions.map((opt) => {
                  const isActive = transportKind === opt.value
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 cursor-pointer text-[13px] font-semibold transition-all ${
                        isActive
                          ? "border-primary bg-blue-50 text-primary"
                          : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} className="sr-only" />
                      <span className="text-base leading-none">{opt.icon}</span>
                      {opt.label}
                    </label>
                  )
                })}
              </RadioGroup>
            </div>
          )}

          {/* 장소명 */}
          <div>
            <FieldLabel>📌 장소명</FieldLabel>
            <Input
              value={placeName}
              onChange={(e) => onPlaceNameChange(e.target.value)}
              placeholder="직접 입력"
              className={inputCls}
            />
          </div>

          {/* 주소 검색 */}
          <div>
            <FieldLabel>🔍 주소 검색</FieldLabel>
            <Input
              ref={inputRef}
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="주소 또는 장소명으로 검색"
              className={inputCls}
            />
            {coords.lat && coords.lng && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200">
                <MapPreview lat={coords.lat} lng={coords.lng} />
              </div>
            )}
          </div>

          {/* 메모 */}
          <div>
            <FieldLabel>📝 메모</FieldLabel>
            <Textarea
              value={placeMemo}
              onChange={(e) => onPlaceMemoChange(e.target.value)}
              placeholder="예약 정보, 운영시간, 팁 등을 기록해보세요"
              className={`${inputCls} min-h-[90px] resize-none`}
            />
          </div>
        </div>

        {/* ── 하단 버튼 ── */}
        <div className="px-5 pb-6 pt-1 flex gap-2.5">
          {editingItem ? (
            <button
              onClick={onDelete}
              className="flex-1 py-3 rounded-2xl border-2 border-red-100 bg-red-50 text-red-500 text-[14px] font-bold transition-all hover:bg-red-100 active:scale-[.97]"
            >
              삭제
            </button>
          ) : (
            <button
              onClick={() => { onReset(); onOpenChange(false) }}
              className="flex-1 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-500 text-[14px] font-bold transition-all hover:bg-gray-100 active:scale-[.97]"
            >
              취소
            </button>
          )}

          <button
            onClick={onSave}
            className="flex-1 py-3 rounded-2xl bg-primary text-white text-[14px] font-bold shadow-[0_4px_14px_rgba(0,132,255,.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,132,255,.4)] active:scale-[.97]"
          >
            {editingItem ? "수정하기" : "추가하기"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}