"use client"

import * as React from "react"

const INITIAL_ITEMS = [
  { label: "여권 유효기간 확인",  checked: true,  cat: "📄 서류" },
  { label: "항공권 e-티켓 출력",  checked: true,  cat: null },
  { label: "숙소 예약 확인서",    checked: true,  cat: null },
  { label: "여행자 보험 가입",    checked: true,  cat: "💊 건강/안전" },
  { label: "상비약 챙기기",       checked: false, cat: null },
  { label: "엔화 환전",           checked: true,  cat: "💴 금전" },
  { label: "포켓 와이파이 예약",  checked: false, cat: null },
] as const

type CheckItem = { label: string; checked: boolean; cat: string | null }

export function ChecklistSection() {
  const [items, setItems] = React.useState<CheckItem[]>([...INITIAL_ITEMS])

  const toggle = (i: number) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, checked: !it.checked } : it)))

  const checked = items.filter((it) => it.checked).length

  return (
    <section className="px-6 py-16 bg-gradient-to-b from-blue-50 to-white">
      <div data-reveal>
        <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">✦ 준비물 체크리스트</p>
        <h2 className="text-[1.65rem] font-black tracking-tight text-gray-900 leading-snug mb-2">
          빠진 게 없는지<br />
          <span className="text-primary">한 번 더 확인해요</span>
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          여행 전 필수 준비물 목록을 만들고 하나씩 체크해보세요.
        </p>
      </div>

      <div
        className="bg-white rounded-[24px] p-5 shadow-[0_8px_24px_rgba(0,80,200,.10)] border border-blue-50"
        data-reveal
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[15px] font-extrabold text-gray-800">🗾 도쿄 여행 준비물</p>
          <p className="text-[12px] font-bold text-primary">
            {checked} / {items.length}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500"
            style={{ width: `${(checked / items.length) * 100}%` }}
          />
        </div>

        {/* Items */}
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {item.cat && (
              <p className="text-[11px] font-bold text-primary tracking-wide mt-3 mb-1">
                {item.cat}
              </p>
            )}
            <div
              className="flex items-center gap-2.5 py-2 border-b border-gray-100 last:border-0 cursor-pointer select-none"
              onClick={() => toggle(i)}
            >
              <div
                className={`w-[22px] h-[22px] rounded-[7px] border-2 flex items-center justify-center shrink-0 transition-all ${
                  item.checked ? "bg-primary border-primary" : "border-gray-200"
                }`}
              >
                {item.checked && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 10">
                    <path
                      d="M1 5l3.5 3.5L11 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-[13px] font-medium transition-colors ${
                  item.checked ? "line-through text-gray-400" : "text-gray-700"
                }`}
              >
                {item.label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}