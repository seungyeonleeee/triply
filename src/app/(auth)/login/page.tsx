"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { AuthField } from "@/components/auth/AuthField"

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [loading,  setLoading]  = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { alert(error.message); return }
    router.push("/trips")
  }

  return (
    <AuthLayout
      emoji="✈️"
      title="지금 바로 로그인 하세요!"
      desc="여행을 더 쉽게! 나만의 여행 플래너를 시작하세요."
      footer={
        <>
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            회원가입
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => { e.preventDefault(); handleLogin() }}
      >
        <AuthField
          id="email"
          label="이메일"
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthField
          id="password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          rightLabel={
            <Link href="/forgot-password" className="text-[11px] text-primary font-semibold hover:underline">
              비밀번호를 잊으셨나요?
            </Link>
          }
        />

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary disabled:bg-gray-200 text-white disabled:text-gray-400 font-extrabold text-[15px] py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(0,132,255,.35)] disabled:shadow-none transition-all hover:-translate-y-0.5 active:scale-[.98]"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </form>
    </AuthLayout>
  )
}