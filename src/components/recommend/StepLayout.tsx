// src/components/recommend/StepLayout.tsx
//
// 역할: 모든 스텝(1~5)이 공통으로 쓰는 레이아웃
//   - 상단 파란 헤더 (진행바 + 스텝 번호 + 제목 + 설명)
//   - 선택 영역 (children)
//   - 하단 고정 버튼 (이전 / 다음)
//
// Props:
//   step       : 현재 스텝 번호 (1~5)
//   total      : 전체 스텝 수 (5)
//   emoji      : 헤더 이모지
//   title      : 질문 제목
//   desc       : 부제목
//   canNext    : 다음 버튼 활성화 여부 (선택 완료 시 true)
//   onNext     : 다음 버튼 클릭 핸들러
//   onPrev     : 이전 버튼 클릭 핸들러 (1스텝이면 undefined)
//   children   : 각 스텝의 선택 UI

interface StepLayoutProps {
  step: number
  total: number
  emoji: string
  title: string
  desc: string
  canNext: boolean
  onNext: () => void
  onPrev?: () => void
  children: React.ReactNode
}

export function StepLayout({
  step, total, emoji, title, desc,
  canNext, onNext, onPrev, children,
}: StepLayoutProps) {
  const pct = (step / total) * 100

  return (
    <div className="min-h-[calc(100vh-57px)] w-full bg-[#F0F6FF] flex flex-col">

      {/* ── 상단 헤더 ── */}
      <div className="bg-primary px-5 pt-6 pb-10 relative overflow-hidden">
        {/* 데코 블롭 */}
        <div className="pointer-events-none absolute -top-10 -right-12 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.15)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(255,211,64,.12)_0%,transparent_70%)]" />

        <div className="relative z-10">
          {/* 진행바 */}
          <div className="flex gap-1.5 mb-5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-500"
                style={{ background: i < step ? "white" : "rgba(255,255,255,0.3)" }}
              />
            ))}
          </div>

          {/* 스텝 번호 + 이모지 */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-[16px] flex items-center justify-center text-2xl shrink-0">
              {emoji}
            </div>
            <div>
              <p className="text-white/60 text-[11px] font-bold tracking-widest uppercase">
                {step} / {total}
              </p>
              <h1 className="text-[1.35rem] font-black text-white leading-tight tracking-tight">
                {title}
              </h1>
            </div>
          </div>

          <p className="text-white/70 text-[13px] leading-relaxed pl-[60px]">{desc}</p>
        </div>
      </div>

      {/* ── 선택 영역 — 헤더에서 올라오는 카드 ── */}
      <div className="flex-1 -mt-5 px-4 pb-26 overflow-y-auto">
        <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,80,200,.10)] border border-blue-50 p-4 min-h-[200px] relative">
          {children}
        </div>
      </div>

      {/* ── 하단 고정 버튼 ── */}
      <div className="fixed bottom-0 md:min-w-xl left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-100 px-4 py-4 flex gap-2.5 max-w-[430px] mx-auto">
        {onPrev && (
          <button
            onClick={onPrev}
            className="w-12 h-12 rounded-2xl border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:border-gray-300 active:scale-[.97] transition-all shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!canNext}
          className="flex-1 h-12 rounded-2xl bg-primary disabled:bg-gray-200 text-white disabled:text-gray-400 font-extrabold text-[15px] shadow-[0_4px_14px_rgba(0,132,255,.35)] disabled:shadow-none transition-all hover:-translate-y-0.5 active:scale-[.97]"
        >
          {step === total ? "✨ 일정 추천받기" : "다음"}
        </button>
      </div>
    </div>
  )
}
