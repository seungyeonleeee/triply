// src/components/home/FeaturesSection.tsx

const FEATURES = [
  {
    icon: "📍",
    bg: "bg-blue-50",
    title: "Google 장소 검색",
    desc: "구글 API로 전 세계 장소를 클릭 한 번에 일정에 추가",
  },
  {
    icon: "🗺️",
    bg: "bg-emerald-50",
    title: "이동 거리 자동 계산",
    desc: "장소 간 거리를 자동으로 계산해 동선을 최적화",
  },
  {
    icon: "📝",
    bg: "bg-amber-50",
    title: "장소별 메모",
    desc: "예약 정보·팁·할 일을 각 장소에 바로 기록",
  },
  {
    icon: "✅",
    bg: "bg-rose-50",
    title: "준비물 체크리스트",
    desc: "여행 전 필수 준비물을 빠짐없이 체크",
  },
] as const

export function FeaturesSection() {
  return (
    <section className="px-6 py-16">
      <div data-reveal>
        <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">✦ 주요 기능</p>
        <h2 className="text-[1.65rem] font-black tracking-tight text-gray-900 leading-snug mb-2">
          여행의 모든 것,<br />
          <span className="text-primary">하나로</span>
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-7">
          번거롭게 여러 앱 쓸 필요 없어요.<br />
          Triply 하나로 여행 준비 끝!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            data-reveal
            data-delay={String(i + 1) as "1" | "2" | "3" | "4"}
            className="feat-card bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm"
          >
            <div className={`w-11 h-11 ${f.bg} rounded-[14px] flex items-center justify-center text-2xl mb-3`}>
              {f.icon}
            </div>
            <p className="text-[13.5px] font-extrabold text-gray-800 mb-1 leading-snug">{f.title}</p>
            <p className="text-[11.5px] text-gray-500 leading-relaxed wrap-break-word keep-all">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}