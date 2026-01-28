"use client";

import Link from "next/link";
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
        <Link href="/" className="text-lg font-bold text-primary">
          Triply
        </Link>

        {/* Right */}
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/trips"
                className="text-sm text-gray-700 hover:underline"
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
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
