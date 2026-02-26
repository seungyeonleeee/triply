// src/components/home/CtaSection.tsx

import Link from "next/link"

const PERKS = [
  {
    icon: "📍",
    title: "Google Maps 장소 무제한 추가",
    sub: "검색하고 클릭 한 번이면 일정에 추가 완료",
  },
  {
    icon: "✨",
    title: "AI 맞춤 일정 추천 3회 무료",
    sub: "취향 입력하면 완성된 일정을 바로 받아보세요",
  },
  {
    icon: "☁️",
    title: "일정 클라우드 자동 저장",
    sub: "어떤 기기에서도 내 여행 일정 확인",
  },
] as const

export function CtaSection() {
  return (
    <section className="px-6 py-20 bg-gradient-to-br from-[#0060CC] via-primary to-[#3FA0FF] relative overflow-hidden text-center">
      {/* Deco blobs */}
      <div className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.12)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-8 -left-10 w-52 h-52 rounded-full bg-[radial-gradient(circle,rgba(255,211,64,.14)_0%,transparent_70%)]" />

      <div className="relative z-10">
        <span className="text-5xl block mb-4">🚀</span>
        <h2 className="text-[1.75rem] font-black text-white tracking-tight leading-snug mb-3">
          지금 바로 시작해요,<br />무료로!
        </h2>
        <p className="text-[14px] text-white/75 leading-relaxed mb-8">
          가입하는 순간부터 나만의 여행 플래너를 무료로.<br />
          지금 바로 첫 여행 일정을 만들어보세요.
        </p>

        {/* Perks */}
        <div className="flex flex-col gap-3 mb-8 text-left">
          {PERKS.map((p) => (
            <div
              key={p.title}
              className="flex items-center gap-3 bg-white/12 backdrop-blur border border-white/20 rounded-[14px] px-4 py-3"
            >
              <span className="text-[22px] shrink-0">{p.icon}</span>
              <div>
                <p className="text-[13px] font-bold text-white">{p.title}</p>
                <p className="text-[11px] text-white/70 mt-0.5">{p.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/signup"
          className="block w-full bg-white text-primary font-extrabold text-[16px] py-4 rounded-[16px] shadow-[0_8px_24px_rgba(0,0,0,.2)] mb-3 transition-transform hover:-translate-y-0.5 active:scale-[.98]"
        >
          🎉 무료로 시작하기
        </Link>
        <p className="text-[13px] text-white/65">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-white font-bold underline">
            로그인
          </Link>
        </p>
      </div>
    </section>
  )
}