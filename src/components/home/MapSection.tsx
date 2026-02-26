// src/components/home/MapSection.tsx

const PINS = [
  { top: "18%", left: "22%", label: "① 아사쿠사",   cls: "bg-primary text-white" },
  { top: "30%", left: "58%", label: "② 아키하바라", cls: "bg-yellow-400 text-gray-800" },
  { top: "52%", left: "42%", label: "③ 시부야",     cls: "bg-emerald-500 text-white" },
] as const

const BADGES = [
  { top: "28%", left: "34%", dist: "2.8km" },
  { top: "46%", left: "54%", dist: "5.1km" },
] as const

export function MapSection() {
  return (
    <section className="px-6 py-16 bg-white" data-reveal>
      <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">✦ 이동 거리 계산</p>
      <h2 className="text-[1.65rem] font-black tracking-tight text-gray-900 leading-snug mb-2">
        동선 한눈에 파악,<br />
        <span className="text-primary">거리도 자동으로</span>
      </h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        장소를 추가하면 이동 거리를 자동 계산해드려요.<br />
        무리한 동선은 이제 그만!
      </p>

      <div className="rounded-[24px] overflow-hidden border border-gray-200 shadow-[0_8px_32px_rgba(0,80,200,.12)]">
        {/* Search bar */}
        <div className="bg-white flex items-center gap-2.5 px-3.5 py-2.5 border-b border-gray-100">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-400">
            🔍 Google Maps로 장소 검색...
          </div>
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white text-base shrink-0">
            ＋
          </div>
        </div>

        {/* Fake map */}
        <div className="relative h-48 bg-[#E8F0FE] overflow-hidden">
          {/* grid */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(#CBD5E1 1px,transparent 1px),linear-gradient(90deg,#CBD5E1 1px,transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
          {/* roads */}
          <div className="absolute left-0 right-0 h-[3px] bg-white shadow-sm" style={{ top: "40%" }} />
          <div className="absolute left-0 right-0 h-[3px] bg-white shadow-sm" style={{ top: "65%" }} />
          <div className="absolute top-0 bottom-0 w-[3px] bg-white shadow-sm" style={{ left: "30%" }} />
          <div className="absolute top-0 bottom-0 w-[3px] bg-white shadow-sm" style={{ left: "65%" }} />

          {/* Pins */}
          {PINS.map((pin) => (
            <div
              key={pin.label}
              className="absolute flex flex-col items-center"
              style={{ top: pin.top, left: pin.left }}
            >
              <span className={`${pin.cls} text-[10px] font-bold px-2 py-1 rounded-lg shadow-md whitespace-nowrap`}>
                {pin.label}
              </span>
              <div className="w-0.5 h-1.5 bg-current opacity-60" />
              <div className="w-2 h-2 rounded-full bg-current" />
            </div>
          ))}

          {/* Distance badges */}
          {BADGES.map((b) => (
            <div
              key={b.dist}
              className="absolute text-[10px] font-bold text-primary bg-white border border-blue-100 rounded-full px-2.5 py-1 shadow-sm"
              style={{ top: b.top, left: b.left }}
            >
              {b.dist}
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-white flex items-center justify-between px-4 py-3">
          <span className="text-[12px] font-bold text-gray-700">총 이동 거리</span>
          <span className="text-[17px] font-black text-primary">7.9 km</span>
        </div>
      </div>
    </section>
  )
}