// src/components/recommend/StepStyle.tsx
//
// 역할: 4/5 — 여행 스타일 선택
//   - 복수 선택 가능 (최대 3개 권장)
//   - 이모지 + 라벨 칩 형태
//   - 선택 개수 실시간 표시
//
// Props:
//   value    : 선택된 스타일 배열
//   onChange : 스타일 토글 시 호출

interface StepStyleProps {
  value: string[]
  onChange: (styles: string[]) => void
}

const STYLES = [
  { label: "맛집 탐방",  emoji: "🍽️", desc: "현지 맛집 투어" },
  { label: "관광·명소",  emoji: "🗺️", desc: "유명 명소 방문" },
  { label: "자연·힐링",  emoji: "🌿", desc: "자연 속 힐링" },
  { label: "쇼핑",      emoji: "🛍️", desc: "쇼핑 천국 탐방" },
  { label: "카페·감성",  emoji: "☕", desc: "감성 카페 투어" },
  { label: "액티비티",   emoji: "🎯", desc: "스포츠·체험" },
  { label: "역사·문화",  emoji: "🏛️", desc: "문화유산 탐방" },
  { label: "인생샷",     emoji: "📸", desc: "포토스팟 투어" },
  { label: "야경·나이트", emoji: "🌃", desc: "밤의 도시 탐방" },
] as const

const MAX_SELECT = 3

export function StepStyle({ value, onChange }: StepStyleProps) {
  const toggle = (label: string) => {
    if (value.includes(label)) {
      onChange(value.filter((v) => v !== label))
    } else {
      if (value.length >= MAX_SELECT) return   // 최대 3개
      onChange([...value, label])
    }
  }

  return (
    <div>
      {/* 선택 개수 안내 */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] text-gray-400 font-medium">
          최대 {MAX_SELECT}개 선택
        </p>
        <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full transition-all ${
          value.length > 0 ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
        }`}>
          {value.length} / {MAX_SELECT}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {STYLES.map((s) => {
          const isSelected = value.includes(s.label)
          const isDisabled = !isSelected && value.length >= MAX_SELECT

          return (
            <button
              key={s.label}
              onClick={() => toggle(s.label)}
              disabled={isDisabled}
              className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-[18px] border-2 transition-all active:scale-[.97] ${
                isSelected
                  ? "bg-primary border-primary shadow-[0_4px_14px_rgba(0,132,255,.3)]"
                  : isDisabled
                    ? "border-gray-100 bg-gray-50 opacity-40"
                    : "bg-white border-gray-200 hover:border-primary/40 hover:bg-blue-50/40"
              }`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <p className={`text-[11px] font-extrabold text-center leading-tight ${
                isSelected ? "text-white" : "text-gray-700"
              }`}>
                {s.label}
              </p>
            </button>
          )
        })}
      </div>

      {/* 선택된 스타일 미리보기 */}
      {value.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {value.map((v) => (
            <span key={v} className="inline-flex items-center gap-1 bg-blue-50 text-primary text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-100">
              {STYLES.find((s) => s.label === v)?.emoji} {v}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
