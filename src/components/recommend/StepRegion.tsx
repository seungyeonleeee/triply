// src/components/recommend/StepRegion.tsx
//
// 역할: 1/5 — 여행지 선택
//   - 대륙별 탭 (전체 / 일본 / 동남아 / 유럽 / 국내 / 미주 등)
//   - 탭 클릭 → 해당 대륙 도시만 표시
//   - 도시 칩 클릭 → 선택 (단일 선택)
//
// Props:
//   value    : 현재 선택된 도시 문자열
//   onChange : 도시 선택 시 호출

interface StepRegionProps {
  value: string
  onChange: (city: string) => void
}

const REGIONS: { label: string; cities: string[] }[] = [
  {
    label: "일본",
    cities: ["도쿄", "오사카", "후쿠오카", "삿포로", "나고야", "교토", "오키나와"],
  },
  {
    label: "동남아",
    cities: ["방콕", "발리", "다낭", "싱가포르", "세부", "푸꾸옥", "코타키나발루", "치앙마이", "호치민", "하노이", "쿠알라룸푸르", "푸켓"],
  },
  {
    label: "유럽",
    cities: ["파리", "로마", "바르셀로나", "런던", "프라하", "빈", "암스테르담", "피렌체", "리스본", "마드리드", "부다페스트", "뮌헨"],
  },
  {
    label: "국내",
    cities: ["제주", "부산", "강릉·속초", "경주", "전주", "여수", "인천", "통영·거제"],
  },
  {
    label: "미국",
    cities: ["뉴욕", "로스앤젤레스", "하와이", "샌프란시스코", "밴쿠버", "토론토"],
  },
  {
    label: "기타",
    cities: ["두바이", "홍콩", "타이베이", "시드니", "괌", "사이판"],
  },
]

export function StepRegion({ value, onChange }: StepRegionProps) {
  const [activeTab, setActiveTab] = React.useState(0)

  const current = REGIONS[activeTab]

  return (
    <div>
      {/* 대륙 탭 — 가로 스크롤 */}
      <div
        className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1 border-b border-gray-200"
        style={{ scrollbarWidth: "none" }}
      >
        {REGIONS.map((r, i) => (
          <button
            key={r.label}
            onClick={() => setActiveTab(i)}
            className={`shrink-0 text-sm font-bold px-3.5 py-1.5 rounded-full border-2 transition-all ${
              activeTab === i
                ? "bg-primary border-primary text-white shadow-[0_3px_10px_rgba(0,132,255,.3)]"
                : "border-gray-200 text-gray-500 bg-white hover:border-primary/40"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* 선택된 대륙의 도시 칩 그리드 */}
      <div className="flex flex-wrap gap-2">
        {current.cities.map((city) => {
          const isSelected = value === city
          return (
            <button
              key={city}
              onClick={() => onChange(city)}
              className={`text-[13px] font-bold px-4 py-2 rounded-xl border-2 transition-all active:scale-[.97] ${
                isSelected
                  ? "bg-primary border-primary text-white shadow-[0_4px_12px_rgba(0,132,255,.35)]"
                  : "border-gray-200 bg-white text-gray-600 hover:border-primary/40 hover:bg-blue-50/50"
              }`}
            >
              {/* {isSelected && <span className="mr-1">✓</span>} */}
              {city}
            </button>
          )
        })}
      </div>

      {/* 선택된 도시 표시 */}
      {value && (
        <div className="mt-4 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2.5">
          <span className="text-primary text-base">📍</span>
          <p className="text-[13px] font-bold text-primary">{value} 선택됨</p>
        </div>
      )}
    </div>
  )
}

// React import (Next.js에서 자동 처리되지만 명시)
import * as React from "react"
