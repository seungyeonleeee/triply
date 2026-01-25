"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    // 로그인 성공 → 여행 목록으로 이동
    router.push("/trips");
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-xl font-bold">Triply 로그인</h1>

        <input
          type="email"
          placeholder="이메일"
          className="mb-3 w-full rounded border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호"
          className="mb-6 w-full rounded border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </div>
    </div>
  );
}
