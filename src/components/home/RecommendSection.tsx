"use client"

import * as React from "react"
import Link from "next/link"

const STYLE_CHIPS = [
  "🏙️ 도시 탐방",
  "🌿 자연 힐링",
  "🍽️ 맛집 투어",
  "🎡 액티비티",
  "🛍️ 쇼핑",
  "📸 인생샷",
] as const

const REC_CARDS = [
  {
    emoji: "🗾",
    bg: "bg-blue-50",
    tags: ["도시 탐방", "맛집"],
    title: "도쿄 핵심 코스",
    meta: "3박 4일 · 일본 도쿄",
    days: 4,
    tagCls: "text-primary bg-blue-100",
  },
  {
    emoji: "🌊",
    bg: "bg-emerald-50",
    tags: ["자연 힐링"],
    title: "세부 힐링 여행",
    meta: "4박 5일 · 필리핀 세부",
    days: 5,
    tagCls: "text-emerald-600 bg-emerald-100",
  },
  {
    emoji: "🏛️",
    bg: "bg-orange-50",
    tags: ["문화 탐방", "맛집"],
    title: "로마 감성 여행",
    meta: "5박 6일 · 이탈리아 로마",
    days: 6,
    tagCls: "text-orange-600 bg-orange-100",
  },
] as const

interface RecommendSectionProps {
  isLoggedIn: boolean
}

export function RecommendSection({ isLoggedIn }: RecommendSectionProps) {
  const [activeStyle, setActiveStyle] = React.useState(0)

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      {/* Heading */}
      <div className="px-6" data-reveal>
        <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">✦ AI 일정 추천</p>
        <h2 className="text-[1.65rem] font-black tracking-tight text-gray-900 leading-snug mb-2">
          내 취향에 딱 맞는<br />
          <span className="text-primary">일정 추천</span>
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          여행 스타일을 알려주면 맞춤 일정을 바로 추천해드려요.
        </p>
      </div>

      {/* Style chips — horizontal scroll */}
      <div
        className="mt-5 flex gap-2.5 overflow-x-auto px-6 pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {STYLE_CHIPS.map((chip, i) => (
          <button
            key={chip}
            onClick={() => setActiveStyle(i)}
            className={`shrink-0 border-2 border-gray-200 bg-white text-gray-500 text-[13px] font-bold px-4 py-2 rounded-full transition-all ${
              activeStyle === i ? "chip-active" : "hover:border-primary/40"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Recommend cards */}
      <div className="mt-5 px-6 flex flex-col gap-3" data-reveal>
        {REC_CARDS.map((card) => (
          <div
            key={card.title}
            className="rec-card bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-sm flex items-stretch"
          >
            <div className={`w-[88px] shrink-0 ${card.bg} flex items-center justify-center text-4xl`}>
              {card.emoji}
            </div>
            <div className="flex-1 p-3.5">
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {card.tags.map((t) => (
                  <span key={t} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.tagCls}`}>
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-[15px] font-extrabold text-gray-800 mb-0.5">{card.title}</p>
              <p className="text-[12px] text-gray-400 mb-2">{card.meta}</p>
              <div className="flex gap-1.5">
                {Array.from({ length: card.days }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-blue-50 text-primary flex items-center justify-center text-[9px] font-bold"
                  >
                    D{i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-6 mt-5">
        <Link
          href={isLoggedIn ? "/trips" : "/signup"}
          className="btn-brand w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-white font-bold text-[15px]"
        >
          ✨ 내 취향 일정 추천받기
        </Link>
      </div>
    </section>
  )
}