"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { AuthField } from "@/components/auth/AuthField"

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("")
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)   // 전송 완료 상태

  const handleReset = async () => {
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) { alert(error.message); return }
    setSent(true)
  }

  return (
    <AuthLayout
      emoji="🔑"
      title="비밀번호 찾기"
      desc="가입한 이메일을 입력하면 재설정 링크를 보내드려요."
      footer={
        <>
          기억나셨나요?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            로그인으로 돌아가기
          </Link>
        </>
      }
    >
      {sent ? (
        /* ── 전송 완료 상태 ── */
        <div className="py-6 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 bg-emerald-50 rounded-[18px] flex items-center justify-center text-3xl">
            📬
          </div>
          <p className="text-[15px] font-extrabold text-gray-800">이메일을 보냈어요!</p>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700">{email}</span>으로<br />
            비밀번호 재설정 링크를 발송했어요.
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            이메일이 안 보이면 스팸함을 확인해주세요.
          </p>
        </div>
      ) : (
        /* ── 이메일 입력 폼 ── */
        <form
          className="space-y-4"
          onSubmit={(e) => { e.preventDefault(); handleReset() }}
        >
          <AuthField
            id="email"
            label="이메일"
            type="email"
            placeholder="가입한 이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-primary disabled:bg-gray-200 text-white disabled:text-gray-400 font-extrabold text-[15px] py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(0,132,255,.35)] disabled:shadow-none transition-all hover:-translate-y-0.5 active:scale-[.98]"
            >
              {loading ? "전송 중..." : "재설정 이메일 보내기"}
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}