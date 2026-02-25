"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
    <div className="size-full min-h-[calc(100vh-58px)] flex flex-col items-center justify-center p-6 bg-gray-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-xl font-bold text-gray-600">로그인</CardTitle>
          <CardDescription className="text-gray-500">여행을 더 쉽게! 나만의 여행 플래너를 시작하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="space-y-2">
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">이메일</label>
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">비밀번호</label>
                <Link href="/forgot-password" className="text-xs text-[#0084FF] hover:underline">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-md p-5"
            >
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-sm text-gray-600">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-[#0084FF] hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
