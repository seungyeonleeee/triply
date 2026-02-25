"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("비밀번호가 변경되었습니다.");
    router.push("/login");
  };

  return (
    <div className="size-full min-h-[calc(100vh-58px)] flex items-center justify-center p-6 bg-gray-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="space-y-2 text-center px-0">
          <CardTitle className="text-xl font-bold text-gray-600">새 비밀번호 설정</CardTitle>
          <CardDescription className="text-gray-500">
            새로운 비밀번호를 입력해주세요.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                새 비밀번호 <span className="text-primary">*</span>
              </label>
              <Input
                required
                type="password"
                placeholder="새 비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                비밀번호 확인 <span className="text-primary">*</span>
              </label>
              <Input
                required
                type="password"
                placeholder="비밀번호 다시 입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full text-md p-5">
              {loading ? "변경 중..." : "비밀번호 변경"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}