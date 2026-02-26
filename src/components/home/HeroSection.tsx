"use client"

import Link from "next/link"

interface HeroSectionProps {
  isLoggedIn: boolean
}

const PHONE_PLACES = [
  {
    icon: "🛬",
    bg: "bg-blue-50",
    name: "나리타 국제공항",
    meta: "09:30 도착 · 입국 심사",
    dist: "시작",
    distCls: "text-emerald-500 bg-emerald-50",
  },
  {
    icon: "⛩️",
    bg: "bg-orange-50",
    name: "아사쿠사 센소지",
    meta: "13:00 · 관광명소",
    dist: "74km",
    distCls: "text-primary bg-blue-50",
  },
  {
    icon: "🍜",
    bg: "bg-purple-50",
    name: "이치란 라멘 본점",
    meta: "15:30 · 식당 · 메모 있음 📝",
    dist: "1.2km",
    distCls: "text-primary bg-blue-50",
  },
]

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#E8F3FF] via-[#F0F9FF] to-white min-h-svh flex flex-col items-center pt-17.5">
      {/* Blobs */}
      <div className="blob-a pointer-events-none absolute -top-16 -right-20 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(0,132,255,.2)_0%,transparent_70%)]" />
      <div className="blob-b pointer-events-none absolute bottom-16 -left-12 w-56 h-56 rounded-full bg-[radial-gradient(circle,rgba(0,212,170,.15)_0%,transparent_70%)]" />

      {/* Copy */}
      <div className="relative z-10 px-6 pt-10 text-center">
        <span className="hero-anim-0 inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3.5 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" />
          여행 일정 플래너 ✈️
        </span>

        <h1 className="hero-anim-1 text-[2rem] font-black leading-[1.2] tracking-tight text-gray-900">
          내 취향대로<br />
          <span className="text-primary">완벽한 여행</span><br />
          한 번에 계획해요
        </h1>

        <p className="hero-anim-2 mt-3.5 text-sm text-gray-500 leading-relaxed">
          장소 검색부터 이동 거리 계산,<br />
          체크리스트까지 — Triply 하나로 충분해요.
        </p>

        <div className="hero-anim-3 mt-7 flex gap-2.5 justify-center">
          <Link
            href={isLoggedIn ? "/trips" : "/signup"}
            className="btn-brand inline-flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-primary text-white font-bold text-[15px]"
          >
            ✈️ {isLoggedIn ? "내 여행 보기" : "일정 만들기"}
          </Link>

        </div>
      </div>

      {/* Phone Mockup */}
      <div className="hero-anim-4 relative z-10 mt-10 px-5 w-full max-w-sm">
        <div className="rounded-[28px] overflow-hidden border border-blue-100 bg-white shadow-[0_20px_60px_rgba(0,80,200,.18)]">
          {/* Header */}
          <div className="bg-primary px-4 py-4">
            <div className="flex justify-between items-center mb-3">
              <span
                className="text-white font-black text-base"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                Triply
              </span>
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-1 h-1 rounded-full bg-white/60" />
                ))}
              </span>
            </div>
            <p className="text-[11px] text-white/80 mb-0.5">나의 다음 여행</p>
            <p className="text-lg font-extrabold text-white">🗾 도쿄 자유여행</p>
            <p className="text-[11px] text-white/80 mt-0.5">2025.03.10 – 03.15 · 5박 6일</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-50 border-b border-gray-100 text-xs font-semibold">
            {["일정", "지도", "체크리스트", "메모"].map((t, i) => (
              <div
                key={t}
                className={`flex-1 text-center py-2.5 ${
                  i === 0 ? "text-primary border-b-2 border-primary bg-white" : "text-gray-400"
                }`}
              >
                {t}
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="p-3.5">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-primary text-[11px] font-bold px-3 py-1 rounded-full mb-3">
              📅 Day 1 · 3월 10일 (월)
            </span>

            {PHONE_PLACES.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2.5 bg-white rounded-2xl px-3 py-2.5 mb-2 shadow-sm border border-gray-100"
              >
                <div className={`w-10 h-10 ${p.bg} rounded-xl flex items-center justify-center text-lg shrink-0`}>
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-800 truncate">{p.name}</p>
                  <p className="text-[11px] text-gray-400">{p.meta}</p>
                </div>
                <span className={`text-[10px] font-bold ${p.distCls} px-2 py-0.5 rounded-full shrink-0`}>
                  {p.dist}
                </span>
              </div>
            ))}

            <button className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-2.5 text-[12px] font-semibold text-gray-400 flex items-center justify-center gap-1.5">
              ＋ Google Maps에서 장소 추가
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}