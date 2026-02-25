"use client";

import Link from "next/link";
import Image from 'next/image'
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/authStore";


export default function Header() {
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="w-full flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={80}
            height={45}
          />
        </Link>

        {/* Right */}
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/trips"
                className="text-sm text-gray-700"
              >
                내 여행
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500"
              >
                로그아웃
              </button>
            </>
          ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-primary"
                >
                  회원가입
                </Link>
              </>
          )}
        </nav>
      </div>
    </header>
  );
}
