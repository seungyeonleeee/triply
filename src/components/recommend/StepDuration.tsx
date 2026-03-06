// src/components/recommend/StepDuration.tsx
//
// 역할: 2/5 — 여행 기간 선택
//   - 카드형 선택 UI (1박2일 ~ 7박8일+)
//   - 각 카드에 추천 태그 ("당일치기에 딱", "가장 인기") 표시
//   - 단일 선택
//
// Props:
//   value    : 선택된 기간 문자열 (예: "3박4일")
//   onChange : 선택 시 호출

interface StepDurationProps {
  value: string
  onChange: (duration: string) => void
}

const DURATIONS = [
  { label: "당일치기", nights: 0, days: 1,  tag: null,          emoji: "⚡" },
  { label: "1박 2일", nights: 1, days: 2,  tag: "가볍게 딱",     emoji: "🌅" },
  { label: "2박 3일", nights: 2, days: 3,  tag: null,          emoji: "✈️" },
  { label: "3박 4일", nights: 3, days: 4,  tag: "가장 인기 🔥",  emoji: "🗺️" },
  { label: "4박 5일", nights: 4, days: 5,  tag: null,          emoji: "🏖️" },
  { label: "5박 6일", nights: 5, days: 6,  tag: null,          emoji: "🌍" },
] as const

export function StepDuration({ value, onChange }: StepDurationProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {DURATIONS.map((d) => {
        const isSelected = value === d.label
        return (
          <button
            key={d.label}
            onClick={() => onChange(d.label)}
            className={`relative flex flex-col items-start p-4 rounded-[20px] border-2 text-left transition-all active:scale-[.97] ${
              isSelected
                ? "bg-primary border-primary text-white shadow-[0_6px_20px_rgba(0,132,255,.35)]"
                : "bg-white border-gray-200 text-gray-700 hover:border-primary/40 hover:bg-blue-50/40"
            }`}
          >
            {/* 추천 태그 */}
            {d.tag && (
              <span className={`absolute -top-2 left-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                isSelected ? "bg-yellow-300 text-gray-800" : "bg-primary text-white"
              }`}>
                {d.tag}
              </span>
            )}

            <span className="text-2xl mb-2">{d.emoji}</span>
            <p className={`text-[15px] font-extrabold ${isSelected ? "text-white" : "text-gray-800"}`}>
              {d.label}
            </p>
            <p className={`text-[11px] mt-0.5 font-medium ${isSelected ? "text-white/75" : "text-gray-400"}`}>
              {d.nights === 0 ? "하루 알차게" : `${d.nights}박 ${d.days}일`}
            </p>

            {isSelected && (
              <div className="absolute top-3 right-3 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
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
