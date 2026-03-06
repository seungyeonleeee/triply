// src/components/recommend/StepCompanion.tsx
//
// 역할: 3/5 — 동행자 선택
//   - 이모지 + 라벨 카드 형태 (2×3 그리드)
//   - 단일 선택
//
// Props:
//   value    : 선택된 동행자 문자열
//   onChange : 선택 시 호출

interface StepCompanionProps {
  value: string
  onChange: (companion: string) => void
}

const COMPANIONS = [
  { label: "혼자",    emoji: "🧍", desc: "나만의 자유 여행" },
  { label: "친구",    emoji: "👫", desc: "함께 웃고 즐기기" },
  { label: "연인",    emoji: "💑", desc: "둘만의 로맨틱 여행" },
  { label: "가족",    emoji: "👨‍👩‍👧", desc: "소중한 가족과 함께" },
  { label: "부모님",  emoji: "👴👵", desc: "감사한 마음으로" },
  { label: "아이와",  emoji: "👶", desc: "즐거운 키즈 여행" },
] as const

export function StepCompanion({ value, onChange }: StepCompanionProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {COMPANIONS.map((c) => {
        const isSelected = value === c.label
        return (
          <button
            key={c.label}
            onClick={() => onChange(c.label)}
            className={`flex flex-col items-center gap-2 py-5 px-3 rounded-[20px] border-2 transition-all active:scale-[.97] ${
              isSelected
                ? "bg-primary border-primary shadow-[0_6px_20px_rgba(0,132,255,.35)] relative"
                : "bg-white border-gray-200 hover:border-primary/40 hover:bg-blue-50/40"
            }`}
          >
            <span className="text-3xl">{c.emoji}</span>
            <div className="text-center">
              <p className={`text-[14px] font-extrabold ${isSelected ? "text-white" : "text-gray-800"}`}>
                {c.label}
              </p>
              <p className={`text-[10px] mt-0.5 ${isSelected ? "text-white/75" : "text-gray-400"}`}>
                {c.desc}
              </p>
            </div>
            {isSelected && (
              <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center absolute top-3 right-3">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 10">
                  <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
