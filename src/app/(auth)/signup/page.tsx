"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { AuthField } from "@/components/auth/AuthField"

export default function SignUpPage() {
  const router = useRouter()
  const [name,            setName]            = useState("")
  const [email,           setEmail]           = useState("")
  const [password,        setPassword]        = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading,         setLoading]         = useState(false)

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    setLoading(false)
    if (error) { alert(error.message); return }
    alert("회원가입이 완료되었습니다. 이메일을 확인해주세요.")
    router.push("/login")
  }

  // 비밀번호 일치 여부 실시간 체크
  const pwMismatch = confirmPassword.length > 0 && password !== confirmPassword

  return (
    <AuthLayout
      emoji="🎉"
      title="Triply 시작하기"
      desc="계정을 만들어 나만의 여행 플래너를 시작해보세요."
      footer={
        <>
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            로그인
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => { e.preventDefault(); handleSignUp() }}
      >
        <AuthField
          id="name"
          label="이름"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
        />

        {/* 비밀번호 확인 — 불일치 시 테두리 빨간색 */}
        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="text-[12px] font-bold text-gray-500 uppercase tracking-wide">
            비밀번호 확인<span className="text-primary ml-0.5">*</span>
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`w-full bg-gray-50 border-2 rounded-2xl px-4 py-3 text-[14px] text-gray-800 placeholder:text-gray-400 outline-none transition-all ${
              pwMismatch
                ? "border-red-400 bg-red-50 focus:border-red-400"
                : "border-gray-200 focus:border-primary focus:bg-white"
            }`}
          />
          {pwMismatch && (
            <p className="text-[11px] text-red-500 font-semibold pl-1">비밀번호가 일치하지 않아요</p>
          )}
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading || pwMismatch}
            className="w-full bg-primary disabled:bg-gray-200 text-white disabled:text-gray-400 font-extrabold text-[15px] py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(0,132,255,.35)] disabled:shadow-none transition-all hover:-translate-y-0.5 active:scale-[.98]"
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </div>
      </form>
    </AuthLayout>
  )
}