interface AuthLayoutProps {
  emoji: string
  title: string
  desc: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthLayout({ emoji, title, desc, children, footer }: AuthLayoutProps) {
  return (
    <div className="w-full min-h-[calc(100vh-57px)] bg-[#F0F6FF] flex flex-col">

      {/* ── 상단 Hero 헤더 ── */}
      <div className="bg-linear-to-br from-primary to-[#3FA0FF] bg-primary px-6 pt-10 pb-14 relative overflow-hidden text-center">
        <div className="pointer-events-none absolute -top-10 -right-12 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.15)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-36 h-36 rounded-full bg-[radial-gradient(circle,rgba(255,211,64,.12)_0%,transparent_70%)]" />

        <div className="relative z-10">
          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-[18px] flex items-center justify-center text-3xl mx-auto mb-4">
            {emoji}
          </div>
          <h1 className="text-[1.6rem] font-black text-white tracking-tight leading-tight mb-1.5">
            {title}
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
        </div>
      </div>

      {/* ── 폼 카드 — 헤더에서 올라오는 효과 ── */}
      <div className="flex-1 px-5 -mt-6 pb-10">
        <div className="bg-white rounded-3xl relative shadow-[0_8px_32px_rgba(0,80,200,.12)] border border-blue-50 overflow-hidden">
          <div className="px-5 py-6 space-y-4">
            {children}
          </div>
        </div>

        {/* 하단 링크 영역 */}
        {footer && (
          <div className="mt-5 text-center text-sm text-gray-500">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}