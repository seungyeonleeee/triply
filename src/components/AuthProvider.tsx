"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    // 최초 세션 확인
    supabase.auth.getSession().then(({ data }) => {
      setAuth(data.session);
    });

    // 로그인/로그아웃 상태 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session);
      } else {
        clearAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, clearAuth]);

  return <>{children}</>;
}
