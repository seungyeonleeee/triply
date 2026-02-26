"use client"

import { useState, useCallback, useEffect } from "react"
import { useTripsStore } from "@/store/tripsStore"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TravelStyle } from "@/types/trip"
import { TRAVEL_STYLES } from "@/constants/trip"
import { cn } from "@/lib/utils"

type Step = "places" | "companions" | "style" | "dates"

interface CreateTripWizardProps {
  variant?: "button" | "iconBox"
}

const COMPANION_OPTIONS = ["혼자", "친구와", "가족과", "연인과", "배우자와", "아이와", "부모님과"]

// 스텝별 메타 정보
const STEP_META: Record<Step, { emoji: string; title: string; desc: string }> = {
  places:     { emoji: "🗺️", title: "어디로 떠나시나요?",      desc: "여행의 이름을 입력해주세요" },
  companions: { emoji: "👫", title: "누구랑 떠나시나요?",      desc: "동행자를 선택해주세요" },
  style:      { emoji: "✨", title: "어떤 스타일이 좋으세요?", desc: "여행 스타일을 골라주세요 (복수 선택 가능)" },
  dates:      { emoji: "📅", title: "언제 떠나세요?",          desc: "여행 날짜를 선택해주세요" },
}

const STEPS: Step[] = ["places", "companions", "style", "dates"]

export default function CreateTripDialog({ variant = "button" }: CreateTripWizardProps) {
  const [open, setOpen]                           = useState(false)
  const [step, setStep]                           = useState<Step>("places")
  const [title, setTitle]                         = useState("")
  const [companions, setCompanions]               = useState<string>("")
  const [companionType, setCompanionType]         = useState<string>("")
  const [showCompanionInput, setShowCompanionInput] = useState(false)
  const [styles, setStyles]                       = useState<string[]>([])
  const [dateRange, setDateRange]                 = useState<DateRange | undefined>()
  const [datePopoverOpen, setDatePopoverOpen]     = useState(false)
  const [numberOfMonths, setNumberOfMonths]       = useState(1)

  const addTrip = useTripsStore((state) => state.addTrip)

  const currentStepIdx = STEPS.indexOf(step)

  const handleNext = useCallback(() => {
    if (step === "places")     setStep("companions")
    else if (step === "companions") setStep("style")
    else if (step === "style") setStep("dates")
  }, [step])

  const handlePrev = useCallback(() => {
    if (step === "companions") setStep("places")
    else if (step === "style") setStep("companions")
    else if (step === "dates") setStep("style")
  }, [step])

  const handleCompanionTypeSelect = useCallback((type: string) => {
    if (type === "기타") {
      setCompanionType(type)
      setShowCompanionInput(true)
      setCompanions("")
    } else {
      setCompanionType(type)
      setShowCompanionInput(false)
      setCompanions(type)
    }
  }, [])

  const handleAddCustomCompanion = useCallback(() => {
    if (companions.trim()) setCompanions(companions.trim())
  }, [companions])

  const handleCreate = useCallback(() => {
    addTrip({
      id: crypto.randomUUID(),
      title: title.trim() || "제목 없음",
      places: [],
      companions: companionType === "혼자" ? undefined : companions,
      travelStyles: styles.length > 0 ? (styles as TravelStyle[]) : undefined,
      startDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
      endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
      createdAt: new Date().toISOString(),
    })

    // 초기화
    setTitle("")
    setCompanions("")
    setCompanionType("")
    setShowCompanionInput(false)
    setStyles([])
    setDateRange(undefined)
    setDatePopoverOpen(false)
    setStep("places")
    setOpen(false)
  }, [title, companionType, companions, styles, dateRange, addTrip])

  const handleDateRangeSelect = useCallback((range: DateRange | undefined) => {
    setDateRange(range)
  }, [])

  useEffect(() => {
    const update = () => setNumberOfMonths(window.innerWidth >= 768 ? 2 : 1)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const meta = STEP_META[step]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "iconBox" ? (
          /* trips/page.tsx 헤더 안에서 쓰는 버튼 */
          <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 text-white text-sm font-bold px-4 py-2.5 rounded-2xl transition-all active:scale-[.97]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            새 여행
          </button>
        ) : (
          <button className="inline-flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-2xl shadow-[0_4px_14px_rgba(0,132,255,.35)] transition-all hover:-translate-y-0.5 active:scale-[.97]">
            ✈️ 여행 추가하기
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-3xl border-0 shadow-[0_24px_60px_rgba(0,0,0,.18)] p-0 gap-0 overflow-hidden">

        {/* ── 상단 컬러 헤더 ── */}
        <div className="bg-primary px-5 pt-10 pb-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-8 -right-8 w-36 h-36 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.15)_0%,transparent_70%)]" />

          {/* 스텝 진행 바 */}
          <div className="flex gap-1.5 mb-5">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                  i <= currentStepIdx ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-[14px] flex items-center justify-center text-2xl shrink-0">
                {meta.emoji}
              </div>
              <div>
                <p className="text-white/70 text-[11px] font-semibold mb-0.5 text-left">
                  {currentStepIdx + 1} / {STEPS.length}
                </p>
                <DialogTitle className="text-[18px] font-black text-white leading-tight">
                  {meta.title}
                </DialogTitle>
              </div>
            </div>
            <p className="text-white/65 text-[12px] ml-14 text-left">{meta.desc}</p>
          </DialogHeader>
        </div>

        {/* ── 폼 본문 ── */}
        <div className="px-5 py-5 min-h-[220px]">

          {/* STEP 1: 여행 이름 */}
          {step === "places" && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3">여행 이름</p>
              <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-1 focus-within:border-primary focus-within:bg-white transition-all">
                <span className="text-xl">✈️</span>
                <input
                  autoFocus
                  placeholder="예: 도쿄, 파리, 제주도..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && title.trim()) handleNext() }}
                  className="flex-1 bg-transparent text-[15px] font-semibold text-gray-800 placeholder:text-gray-400 outline-none py-3"
                />
              </div>
              {title.trim() && (
                <p className="text-[12px] text-primary font-semibold pl-1 mt-1">
                  ✓ &quot;{title.trim()} 여행&quot; 으로 만들어져요
                </p>
              )}
            </div>
          )}

          {/* STEP 2: 동행자 */}
          {step === "companions" && (
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3">동행자 선택</p>
              <div className="flex flex-wrap gap-2">
                {[...COMPANION_OPTIONS, "기타"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleCompanionTypeSelect(option)}
                    className={`px-4 py-2 rounded-full border-2 font-bold text-[13px] transition-all ${
                      companionType === option
                        ? "border-primary bg-blue-50 text-primary shadow-[0_0_0_1px_rgba(0,132,255,.2)]"
                        : "border-gray-200 bg-white text-gray-500 hover:border-primary/40"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {companionType === "기타" && (
                <div className="mt-3 flex gap-2 items-center bg-gray-50 border-2 border-gray-200 rounded-2xl px-3 py-1 focus-within:border-primary focus-within:bg-white transition-all">
                  <input
                    autoFocus
                    placeholder="누구랑 떠나시나요?"
                    value={companions}
                    onChange={(e) => setCompanions(e.target.value)}
                    className="flex-1 bg-transparent text-[13px] text-gray-700 placeholder:text-gray-400 outline-none py-2"
                  />
                  <button
                    onClick={handleAddCustomCompanion}
                    disabled={!companions.trim()}
                    className="shrink-0 bg-primary disabled:bg-gray-200 text-white disabled:text-gray-400 text-[12px] font-bold px-3 py-1.5 rounded-xl transition-all"
                  >
                    확인
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: 여행 스타일 */}
          {step === "style" && (
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3">여행 스타일</p>
              <div className="grid grid-cols-2 gap-2">
                {TRAVEL_STYLES.map((s) => {
                  const isActive = styles.includes(s)
                  return (
                    <button
                      key={s}
                      onClick={() =>
                        setStyles(isActive ? styles.filter((st) => st !== s) : [...styles, s])
                      }
                      className={`px-4 py-2.5 rounded-xl border-2 font-bold text-[13px] transition-all text-left ${
                        isActive
                          ? "border-primary bg-blue-50 text-primary shadow-[0_0_0_1px_rgba(0,132,255,.2)]"
                          : "border-gray-200 bg-white text-gray-500 hover:border-primary/40"
                      }`}
                    >
                      {isActive && <span className="mr-1">✓</span>}
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 4: 날짜 */}
          {step === "dates" && (
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3">여행 날짜</p>
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 bg-gray-50 border-2 rounded-2xl px-4 py-3.5 text-left transition-all",
                      dateRange?.from
                        ? "border-primary bg-blue-50 text-gray-800"
                        : "border-gray-200 text-gray-400 hover:border-primary/40"
                    )}
                  >
                    <CalendarIcon className="w-4 h-4 shrink-0 text-primary" />
                    <span className="text-[14px] font-semibold">
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>{format(dateRange.from, "yyyy.MM.dd")} – {format(dateRange.to, "yyyy.MM.dd")}</>
                        ) : (
                          format(dateRange.from, "yyyy.MM.dd")
                        )
                      ) : (
                        "날짜를 선택해주세요"
                      )}
                    </span>
                    {dateRange?.from && dateRange.to && (
                      <span className="ml-auto text-[11px] font-bold text-primary bg-white px-2 py-0.5 rounded-full border border-blue-100 shrink-0">
                        {Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / 86400000)}박{" "}
                        {Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / 86400000) + 1}일
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="fixed! left-1/2! top-1/2! -translate-x-1/2! -translate-y-1/2! w-auto max-w-[80vw] min-w-75 bg-white p-0 rounded-2xl border-0 shadow-[0_20px_50px_rgba(0,0,0,.15)]"
                  align="center"
                >
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeSelect}
                    numberOfMonths={numberOfMonths}
                  />
                  <div className="flex justify-end border-t border-gray-100 p-3">
                    <button
                      onClick={() => setDatePopoverOpen(false)}
                      disabled={!dateRange?.from || !dateRange?.to}
                      className="bg-primary disabled:bg-gray-200 text-white disabled:text-gray-400 text-[13px] font-bold px-5 py-2 rounded-xl transition-all"
                    >
                      완료
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* ── 하단 버튼 ── */}
        <div className="px-5 pb-5 flex gap-2.5">
          {/* 이전 버튼 */}
          <button
            onClick={handlePrev}
            disabled={step === "places"}
            className="w-12 h-12 shrink-0 rounded-2xl border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:border-gray-300 transition-all active:scale-[.97]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* 다음 / 완료 버튼 */}
          {step === "dates" ? (
            <button
              onClick={handleCreate}
              disabled={title.trim() === "" || !dateRange?.from || !dateRange?.to}
              className="flex-1 h-12 rounded-2xl bg-primary disabled:bg-gray-200 text-white disabled:text-gray-400 text-[15px] font-extrabold shadow-[0_4px_14px_rgba(0,132,255,.35)] disabled:shadow-none transition-all hover:-translate-y-0.5 active:scale-[.97]"
            >
              🎉 여행 만들기
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={step === "places" && title.trim() === ""}
              className="flex-1 h-12 rounded-2xl bg-primary disabled:bg-gray-200 text-white disabled:text-gray-400 text-[15px] font-bold shadow-[0_4px_14px_rgba(0,132,255,.35)] disabled:shadow-none transition-all hover:-translate-y-0.5 active:scale-[.97]"
            >
              다음 →
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}