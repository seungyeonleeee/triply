"use client"
// src/components/recommend/RecommendResult.tsx
//
// 역할: Gemini API로 AI 일정 추천 받기 + 결과 표시 + tripsStore 저장
//
// 동작 흐름:
//   1. 컴포넌트 마운트 시 Gemini API 호출 (선택 정보 → 프롬프트)
//   2. 로딩 중 → 스켈레톤 애니메이션
//   3. 결과 수신 → Day별 파싱 → 카드 렌더링
//   4. "내 여행으로 저장" 버튼 → tripsStore.addTrip + router.push("/trips")
//
// 필요한 환경변수 (.env.local):
//   NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
//
// Gemini API 응답 형식 (JSON):
// {
//   title: "도쿄 3박4일 맛집+관광 코스",
//   days: [
//     {
//       day: 1,
//       date: "Day 1",
//       places: [
//         { time: "09:00", name: "츠키지 시장", category: "맛집", memo: "신선한 해산물 아침" },
//         ...
//       ]
//     }
//   ]
// }

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTripsStore } from "@/store/tripsStore"
import { format } from "date-fns"

interface RecommendAnswers {
  region: string
  duration: string
  companion: string
  styles: string[]
  budget: string
}

interface RecommendResultProps {
  answers: RecommendAnswers
  onRetry: () => void   // 다시 추천받기 → 위자드 처음으로
}

// ── 카테고리 스타일 매핑 ──────────────────────────────────────────────────
const CAT_STYLE: Record<string, { icon: string; bg: string }> = {
  "관광명소": { icon: "🗺️", bg: "bg-blue-50" },
  "맛집":    { icon: "🍽️", bg: "bg-orange-50" },
  "카페":    { icon: "☕",  bg: "bg-amber-50" },
  "쇼핑":    { icon: "🛍️", bg: "bg-pink-50" },
  "숙소":    { icon: "🏨", bg: "bg-purple-50" },
  "교통":    { icon: "🚌", bg: "bg-gray-100" },
  "액티비티": { icon: "🎯", bg: "bg-green-50" },
}
const DEFAULT_CAT = { icon: "📍", bg: "bg-blue-50" }

type PlaceItem = { time?: string; name: string; category: string; memo?: string }
type DayItem   = { day: number; date: string; places: PlaceItem[] }
type AIResult  = { title: string; days: DayItem[] }

// ── 로딩 스켈레톤 ────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map((d) => (
        <div key={d} className="bg-white rounded-[20px] border border-gray-100 p-4">
          <div className="h-5 bg-gray-100 rounded-full w-24 mb-3" />
          {[1, 2, 3].map((p) => (
            <div key={p} className="flex gap-3 mb-2.5">
              <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function RecommendResult({ answers, onRetry }: RecommendResultProps) {
  const router  = useRouter()
  const addTrip = useTripsStore((s) => s.addTrip)

  const [result,  setResult]  = React.useState<AIResult | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error,   setError]   = React.useState<string | null>(null)
  const [saving,  setSaving]  = React.useState(false)

  // ── Claude API 호출 ─────────────────────────────────────────────────────
  React.useEffect(() => {
    const fetchRecommend = async () => {
      setLoading(true)
      setError(null)

      // 기간에서 박수 추출 → days 길이 명시 (JSON 잘림 방지)
      const nightsMatch = answers.duration.match(/(\d+)박/)
      const nights  = nightsMatch ? parseInt(nightsMatch[1]) : 2
      const dayCount = answers.duration === '당일치기' ? 1 : nights + 1

      const prompt = `여행 전문가로서 아래 조건의 ${dayCount}일 여행 일정을 JSON으로만 응답. 다른 텍스트 절대 금지.

조건: 여행지=${answers.region}, 기간=${answers.duration}, 동행자=${answers.companion}, 스타일=${answers.styles.join('/')}, 예산=${answers.budget}

출력 형식(그대로 준수):
{"title":"제목","days":[{"day":1,"date":"Day 1","places":[{"time":"09:00","name":"장소명","category":"관광명소","memo":"설명"}]}]}

규칙: 총 ${dayCount}일치 days 배열, 하루 정확히 4개 places, 실존 장소, category는 관광명소/맛집/카페/쇼핑/숙소/액티비티 중 하나`

      try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
        if (!apiKey) throw new Error("NEXT_PUBLIC_GEMINI_API_KEY가 설정되지 않았어요.")

        // Gemini 2.5 Flash — 무료 티어 지원 (2025 최신 안정 모델)
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,          // ↑ 토큰 넉넉하게
                responseMimeType: "application/json",  // JSON만 반환 강제
              },
            }),
          }
        )

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData?.error?.message ?? "API 요청 실패")
        }

        const data = await res.json()
        // Gemini 응답 구조: candidates[0].content.parts[0].text
        const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

        // 마크다운 펜스 제거 후 JSON 파싱
        const clean = raw
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim()

        // JSON이 중간에 잘렸을 경우 닫는 괄호 보정 시도
        let jsonStr = clean
        const openBraces  = (jsonStr.match(/\{/g) ?? []).length
        const closeBraces = (jsonStr.match(/\}/g) ?? []).length
        const openArr     = (jsonStr.match(/\[/g) ?? []).length
        const closeArr    = (jsonStr.match(/\]/g) ?? []).length
        if (closeArr < openArr)  jsonStr += "]".repeat(openArr - closeArr)
        if (closeBraces < openBraces) jsonStr += "}".repeat(openBraces - closeBraces)

        const parsed: AIResult = JSON.parse(jsonStr)
        setResult(parsed)
      } catch (e: any) {
        setError(e?.message ?? "일정을 불러오지 못했어요. 다시 시도해주세요.")
      } finally {
        setLoading(false)
      }
    }

    fetchRecommend()
  }, [answers])

  // ── tripsStore에 저장 ───────────────────────────────────────────────────
  const handleSave = async () => {
    if (!result) return
    setSaving(true)

    // 오늘부터 기간만큼 날짜 계산
    const nightsMatchSave = answers.duration.match(/(\d+)박/)
    const nights = nightsMatchSave ? parseInt(nightsMatchSave[1]) : 2
    const startDate = format(new Date(), "yyyy-MM-dd")
    const endDate   = format(
      new Date(Date.now() + nights * 86400000),
      "yyyy-MM-dd"
    )

    // Day별 장소를 places 배열로 변환
    const places = result.days.flatMap((d) =>
      d.places.map((p, i) => ({
        id: crypto.randomUUID(),
        name: p.name,
        day: d.day,
        type: "place" as const,
        time: p.time,
        category: p.category,
        memo: p.memo,
        address: "",
      }))
    )

    addTrip({
      id: crypto.randomUUID(),
      title: result.title,
      places,
      companions: answers.companion === "혼자" ? undefined : answers.companion,
      travelStyles: answers.styles as any,
      startDate,
      endDate,
      createdAt: new Date().toISOString(),
    })

    setSaving(false)
    router.push("/trips")
  }

  // ── 에러 상태 ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center text-center py-12 px-6">
        <span className="text-4xl mb-4">😢</span>
        <p className="text-base font-extrabold text-gray-700 mb-2">추천을 불러오지 못했어요</p>
        <p className="text-sm text-gray-400 mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="bg-primary text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-[0_4px_14px_rgba(0,132,255,.35)]"
        >
          다시 시도하기
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-57px)] w-full bg-[#F0F6FF] pb-28">

      {/* ── 결과 헤더 ── */}
      <div className="bg-primary px-5 pt-6 pb-10 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-10 -right-12 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.15)_0%,transparent_70%)]" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white/70 text-[11px] font-bold tracking-widest uppercase">AI 추천 완료 ✨</span>
          </div>
          <h1 className="text-[1.5rem] font-black text-white leading-tight mb-2">
            {loading ? "일정 생성 중..." : (result?.title ?? "")}
          </h1>
          {/* 선택 요약 칩 */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {[answers.region, answers.duration, answers.companion, ...answers.styles, answers.budget]
              .filter(Boolean)
              .map((tag) => (
                <span key={tag} className="bg-white/20 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* ── Day 카드들 ── */}
      <div className="px-4 -mt-5 space-y-3">
        {loading ? (
          <div className="bg-white rounded-[24px] p-4 shadow-[0_8px_24px_rgba(0,80,200,.10)] border border-blue-50 relative">
            <Skeleton />
          </div>
        ) : (
          result?.days.map((day) => (
            <div
              key={day.day}
              className="bg-white rounded-[20px] border border-gray-100 shadow-sm relative overflow-hidden"
            >
              {/* Day 헤더 */}
              <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-100">
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-primary text-[11px] font-bold px-3 py-1 rounded-full">
                  📅 Day {day.day}
                </span>
              </div>

              {/* 장소 목록 */}
              <div className="p-3.5 flex flex-col gap-2">
                {day.places.map((place, i) => {
                  const { icon, bg } = CAT_STYLE[place.category] ?? DEFAULT_CAT
                  const isLast = i === day.places.length - 1
                  return (
                    <React.Fragment key={i}>
                      <div className="flex items-center gap-2.5 bg-white rounded-2xl px-3 py-2.5 border border-gray-100 shadow-sm">
                        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center text-lg shrink-0`}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-gray-800 truncate">{place.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                            {place.time && <span className="font-mono mr-1.5">{place.time}</span>}
                            {place.category}
                            {place.memo && <span className="block">{place.memo}</span>}
                          </p>
                        </div>
                      </div>
                      {!isLast && (
                        <div className="flex flex-col items-center gap-[3px] pl-6">
                          {[0,1,2].map((k) => (
                            <div key={k} className="w-[2px] h-[4px] bg-gray-200 rounded-full" />
                          ))}
                        </div>
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── 하단 버튼 ── */}
      {!loading && result && (
        <div className="fixed bottom-0 md:min-w-xl left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-100 px-4 py-4 flex gap-2.5 max-w-[430px] mx-auto">
          <button
            onClick={onRetry}
            className="w-12 h-12 rounded-2xl border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:border-gray-300 active:scale-[.97] transition-all shrink-0"
          >
            🔄
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-12 rounded-2xl bg-primary disabled:bg-gray-200 text-white font-extrabold text-[15px] shadow-[0_4px_14px_rgba(0,132,255,.35)] disabled:shadow-none transition-all hover:-translate-y-0.5 active:scale-[.97]"
          >
            {saving ? "저장 중..." : "✈️ 내 여행으로 저장하기"}
          </button>
        </div>
      )}
    </div>
  )
}