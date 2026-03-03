"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { AuthField } from "@/components/auth/AuthField"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password,        setPassword]        = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading,         setLoading]         = useState(false)

  const handleUpdate = async () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { alert(error.message); return }
    alert("비밀번호가 변경되었습니다.")
    router.push("/login")
  }

  const pwMismatch = confirmPassword.length > 0 && password !== confirmPassword

  return (
    <AuthLayout
      emoji="🔐"
      title="새 비밀번호 설정"
      desc="새로운 비밀번호를 입력해주세요."
    >
      <form
        className="space-y-4"
        onSubmit={(e) => { e.preventDefault(); handleUpdate() }}
      >
        <AuthField
          id="new-password"
          label="새 비밀번호"
          type="password"
          placeholder="새 비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* 비밀번호 확인 — 불일치 시 빨간 테두리 */}
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
            disabled={loading || pwMismatch || !password}
            className="w-full bg-primary disabled:bg-gray-200 text-white disabled:text-gray-400 font-extrabold text-[15px] py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(0,132,255,.35)] disabled:shadow-none transition-all hover:-translate-y-0.5 active:scale-[.98]"
          >
            {loading ? "변경 중..." : "🔐 비밀번호 변경"}
          </button>
        </div>
      </form>
    </AuthLayout>
  )
}