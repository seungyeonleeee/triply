// src/components/recommend/StepBudget.tsx
//
// 역할: 5/5 — 예산 선택
//   - 1인 기준 예산 카드 선택
//   - 단일 선택
//
// Props:
//   value    : 선택된 예산 문자열
//   onChange : 선택 시 호출

interface StepBudgetProps {
  value: string
  onChange: (budget: string) => void
}

const BUDGETS = [
  {
    label: "알뜰하게",
    range: "50만원 이하",
    emoji: "💰",
    desc: "가성비 숙소·현지 식당 위주",
    color: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    label: "적당하게",
    range: "50~100만원",
    emoji: "💳",
    desc: "중급 호텔·맛집 믹스",
    color: "bg-blue-50",
    textColor: "text-primary",
  },
  {
    label: "여유롭게",
    range: "100~200만원",
    emoji: "🏨",
    desc: "비즈니스급 호텔·레스토랑",
    color: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    label: "럭셔리하게",
    range: "200만원 이상",
    emoji: "✨",
    desc: "5성급 호텔·파인다이닝",
    color: "bg-amber-50",
    textColor: "text-amber-600",
  },
] as const

export function StepBudget({ value, onChange }: StepBudgetProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[11px] text-gray-400 font-medium mb-1">1인 기준 예산 (항공 제외)</p>

      {BUDGETS.map((b) => {
        const isSelected = value === b.label
        return (
          <button
            key={b.label}
            onClick={() => onChange(b.label)}
            className={`relative flex items-center gap-4 p-4 rounded-[20px] border-2 text-left transition-all active:scale-[.97] ${
              isSelected
                ? "bg-primary border-primary shadow-[0_6px_20px_rgba(0,132,255,.35)]"
                : "bg-white border-gray-200 hover:border-primary/40"
            }`}
          >
            {/* 이모지 아이콘 */}
            <div className={`w-12 h-12 ${isSelected ? "bg-white/20" : b.color} rounded-[14px] flex items-center justify-center text-2xl shrink-0`}>
              {b.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className={`text-[15px] font-extrabold ${isSelected ? "text-white" : "text-gray-800"}`}>
                  {b.label}
                </p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? "bg-white/25 text-white" : `${b.color} ${b.textColor}`
                }`}>
                  {b.range}
                </span>
              </div>
              <p className={`text-[12px] ${isSelected ? "text-white/75" : "text-gray-400"}`}>
                {b.desc}
              </p>
            </div>

            {/* 체크 */}
            {isSelected && (
              <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 12 10">
                  <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
