"use client"

import * as React from "react"
import Image from "next/image"
import { useAuthStore } from "@/store/authStore"
import { HeroSection } from "@/components/home/HeroSection"
import { FeaturesSection } from "@/components/home/FeaturesSection"
import { MapSection } from "@/components/home/MapSection"
import { RecommendSection } from "@/components/home/RecommendSection"
import { ChecklistSection } from "@/components/home/ChecklistSection"
import { CtaSection } from "@/components/home/CtaSection"

// ── Scroll-reveal: IntersectionObserver로 [data-reveal] 요소 감지 ──────────
function useScrollReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]")
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  useScrollReveal()
  const user = useAuthStore((s) => s.user)
  const isLoggedIn = !!user

  return (
      <div className="reveal-wrap">
        <HeroSection isLoggedIn={isLoggedIn} />
        <FeaturesSection />
        <MapSection />
        <RecommendSection isLoggedIn={isLoggedIn} />
        <ChecklistSection />
        <CtaSection />

        {/* Footer */}
        <footer className="bg-gray-900 px-6 py-6 text-center">
          <div className="flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Triply"
              width={100}
              height={56}
              className="opacity-90 brightness-0 invert mb-4"
            />
          </div>
          <p className="text-[11px] text-gray-300">© 2026 Triply. 나만의 여행 플래너</p>
        </footer>
      </div>
  )
}