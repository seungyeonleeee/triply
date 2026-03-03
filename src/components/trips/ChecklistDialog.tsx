"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useTripsStore } from "@/store/tripsStore"

// ── 타입: category 필드 optional 추가 (기존 { id, label, checked }와 완전 호환) ──
type ChecklistItem = {
  id: string
  label: string
  checked: boolean
  category?: string   // 선택적 — 기존 데이터는 undefined로 처리됨
}

type Props = {
  tripId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ── 기본 카테고리 제안 ─────────────────────────────────────────────────────
const CATEGORY_SUGGESTIONS = ["📄 서류", "💊 건강/안전", "💴 금전", "👗 의류", "🔌 전자기기", "🧴 세면도구"]

export function ChecklistDialog({ tripId, open, onOpenChange }: Props) {
  const trip       = useTripsStore((s) => s.trips.find((t) => t.id === tripId))
  const addItem    = useTripsStore((s) => s.addChecklistItem)
  const toggleItem = useTripsStore((s) => s.toggleChecklistItem)
  const removeItem = useTripsStore((s) => s.removeChecklistItem)

  // category 필드가 없는 기존 데이터도 그대로 동작
  const items = (trip?.checklist ?? []) as ChecklistItem[]

  const checked = items.filter((i) => i.checked).length
  const total   = items.length
  const pct     = total > 0 ? (checked / total) * 100 : 0

  // ── 아이템 추가 state ───────────────────────────────────────────────────
  const [itemLabel, setItemLabel]               = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("")

  // ── 카테고리 추가 state ─────────────────────────────────────────────────
  const [showCatInput, setShowCatInput] = React.useState(false)
  const [newCatLabel, setNewCatLabel]   = React.useState("")

  // 현재 아이템들에서 사용 중인 카테고리 목록 (순서 유지, 중복 제거)
  const usedCategories = React.useMemo(() => {
    const seen = new Set<string>()
    const result: string[] = []
    items.forEach((it) => {
      if (it.category && !seen.has(it.category)) {
        seen.add(it.category)
        result.push(it.category)
      }
    })
    return result
  }, [items])

  // ── 카테고리별로 아이템 그룹핑 ─────────────────────────────────────────
  const grouped = React.useMemo(() => {
    const map = new Map<string, ChecklistItem[]>()
    usedCategories.forEach((cat) => map.set(cat, []))
    map.set("__none__", [])
    items.forEach((item) => {
      const key = item.category && usedCategories.includes(item.category)
        ? item.category
        : "__none__"
      map.get(key)!.push(item)
    })
    return map
  }, [items, usedCategories])

  const handleAddItem = () => {
    if (!itemLabel.trim()) return
    addItem(tripId, {
      id: crypto.randomUUID(),
      label: itemLabel.trim(),
      checked: false,
      ...(selectedCategory ? { category: selectedCategory } : {}),
    } as any)
    setItemLabel("")
  }

  const handleAddCategory = () => {
    if (!newCatLabel.trim()) return
    setSelectedCategory(newCatLabel.trim())
    setNewCatLabel("")
    setShowCatInput(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, fn: () => void) => {
    if (e.key === "Enter") fn()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-[0_24px_60px_rgba(0,0,0,.18)] p-0 md:gap-0 gap-2 max-h-[90vh] overflow-y-scroll">

        {/* ── 헤더 ── */}
        <DialogHeader className="px-5 pt-5 pb-2">
          <div className="flex flex-col justify-center items-center gap-3 mb-1">
              <DialogTitle className="text-[17px] font-black text-gray-900 leading-tight">
                체크리스트
              </DialogTitle>
              <DialogDescription className="text-[12px] text-gray-400 mt-0.5">
                여행 준비물을 잊지 않도록 추가해보세요!
              </DialogDescription>
          </div>

          {/* 진행률 */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-gray-500">
                {total === 0 ? "아직 항목이 없어요" : pct === 100 ? "🎉 모두 완료!" : "진행 중"}
              </span>
              <span className="text-[12px] font-bold text-primary">{checked} / {total}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </DialogHeader>

        <div className="h-px bg-gray-100 mx-5" />

        {/* ── 아이템 목록 ── */}
        <div className="px-5 max-h-[42vh] overflow-y-auto">
          {total === 0 ? (
            <div className="py-8 flex flex-col items-center gap-2 text-center">
              <span className="text-3xl">📋</span>
              <p className="text-[13px] font-semibold text-gray-400">아직 준비물이 없어요</p>
              <p className="text-[12px] text-gray-300">아래에서 항목을 추가해보세요</p>
            </div>
          ) : (
            Array.from(grouped.entries()).map(([cat, catItems]) => {
              if (catItems.length === 0) return null
              return (
                <div key={cat} className="mb-1">
                  {/* 카테고리 헤더 */}
                  {cat !== "__none__" && (
                    <p className="text-[11px] font-bold text-primary tracking-wide mt-3 mb-1.5">
                      {cat}
                    </p>
                  )}
                  {/* 아이템들 */}
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2.5 py-2.5 border-b border-gray-100 last:border-0"
                    >
                      {/* 커스텀 체크박스 */}
                      <div
                        className={`w-5.5 h-5.5 rounded-[7px] border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                          item.checked
                            ? "bg-primary border-primary"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                        onClick={() => toggleItem(tripId, item.id)}
                      >
                        {item.checked && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 10">
                            <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>

                      {/* 라벨 */}
                      <span
                        className={`flex-1 text-[13px] font-medium cursor-pointer transition-colors select-none ${
                          item.checked ? "line-through text-gray-400" : "text-gray-700"
                        }`}
                        onClick={() => toggleItem(tripId, item.id)}
                      >
                        {item.label}
                      </span>

                      {/* 삭제 버튼 — 항상 보임 */}
                      <button
                        onClick={() => removeItem(tripId, item.id)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all shrink-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )
            })
          )}
        </div>

        <div className="h-px bg-gray-100 mx-5" />

        {/* ── 하단 추가 영역 ── */}
        <div className="px-5 py-4 space-y-3">

          {/* 카테고리 선택 칩 */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">카테고리 선택 (선택사항)</p>
            <div className="flex flex-wrap gap-1.5">
              {/* 없음 칩 */}
              <button
                onClick={() => setSelectedCategory("")}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                  selectedCategory === ""
                    ? "bg-gray-100 border-gray-300 text-gray-600"
                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                }`}
              >
                없음
              </button>

              {/* 기존 사용 카테고리 + 제안 카테고리 (중복 제거) */}
              {[
                ...usedCategories,
                ...CATEGORY_SUGGESTIONS.filter((s) => !usedCategories.includes(s)),
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                    selectedCategory === cat
                      ? "bg-blue-50 border-primary text-primary"
                      : "border-gray-200 text-gray-500 hover:border-primary/40"
                  }`}
                >
                  {cat}
                </button>
              ))}

              {/* 직접 추가 버튼 */}
              {!showCatInput && (
                <button
                  onClick={() => setShowCatInput(true)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-dashed border-gray-300 text-gray-400 hover:border-primary/50 hover:text-primary transition-all"
                >
                  ＋ 직접 추가
                </button>
              )}
            </div>

            {/* 카테고리 직접 입력 인풋 */}
            {showCatInput && (
              <div className="flex gap-2 mt-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="예: 🎒 짐 싸기"
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleAddCategory)}
                  className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-1.5 text-[12px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-primary transition-all"
                />
                <button
                  onClick={handleAddCategory}
                  disabled={!newCatLabel.trim()}
                  className="bg-primary disabled:bg-gray-200 text-white disabled:text-gray-400 text-[12px] font-bold px-3 py-1.5 rounded-xl transition-all"
                >
                  확인
                </button>
                <button
                  onClick={() => { setShowCatInput(false); setNewCatLabel("") }}
                  className="text-gray-400 text-[12px] font-bold px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-all"
                >
                  취소
                </button>
              </div>
            )}
          </div>

          {/* 아이템 추가 인풋 */}
          <div className="flex gap-2 items-center bg-gray-50 border-2 border-gray-200 rounded-2xl px-3 py-1 focus-within:border-primary focus-within:bg-white transition-all">
            <span className="text-gray-300 text-base">＋</span>
            <input
              type="text"
              placeholder={selectedCategory ? `${selectedCategory}에 추가...` : "준비물 추가..."}
              value={itemLabel}
              onChange={(e) => setItemLabel(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleAddItem)}
              className="flex-1 bg-transparent text-[13px] text-gray-700 placeholder:text-gray-400 outline-none py-2"
            />
            <button
              onClick={handleAddItem}
              disabled={!itemLabel.trim()}
              className="shrink-0 bg-primary disabled:bg-gray-200 text-white text-[12px] font-bold px-3 py-1.5 rounded-xl transition-all disabled:text-gray-400 hover:shadow-[0_4px_10px_rgba(0,132,255,.3)] active:scale-[.96]"
            >
              추가
            </button>
          </div>
          <p className="text-[11px] text-gray-300 text-center">Enter 키로도 추가할 수 있어요</p>
        </div>

      </DialogContent>
    </Dialog>
  )
}