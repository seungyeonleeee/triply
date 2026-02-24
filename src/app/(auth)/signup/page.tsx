"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("회원가입이 완료되었습니다. 이메일을 확인해주세요.");
    router.push("/login");
  };

  return (
    <div className="size-full min-h-[calc(100vh-58px)] flex items-center justify-center p-6 bg-white">
      <Card className="w-full max-w-md bg-white shadow-none border-none pt-0">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-xl font-bold text-gray-600">회원가입</CardTitle>
          <CardDescription className="text-gray-500">
            계정을 만들어 여행 계획을 시작해보세요.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
          >
            {/* 이름 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                이름 <span className="text-primary">*</span>
              </label>
              <Input
                required
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700  block mb-2">
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

            {/* 비밀번호 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700  block mb-2">
                비밀번호 <span className="text-primary">*</span>
              </label>
              <Input
                required
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700  block mb-2">
                비밀번호 확인 <span className="text-primary">*</span>
              </label>
              <Input
                required
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full text-md p-5">
              {loading ? "가입 중..." : "회원가입"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}