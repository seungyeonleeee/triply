"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("비밀번호 재설정 이메일을 보냈습니다.");
  };

  return (
    <div className="size-full min-h-[calc(100vh-58px)] flex items-center justify-center p-6 bg-gray-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="space-y-2 text-center px-0">
          <CardTitle className="text-xl font-bold text-gray-600">비밀번호 찾기</CardTitle>
          <CardDescription className="text-gray-500">
            가입한 이메일을 입력하면 재설정 링크를 보내드려요.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleReset();
            }}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                이메일 <span className="text-primary">*</span>
              </label>
              <Input
                required
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full text-md p-5">
              {loading ? "전송 중..." : "재설정 이메일 보내기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}