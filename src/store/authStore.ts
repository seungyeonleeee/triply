import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;

  setAuth: (session: Session | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  setAuth: (session) =>
    set({
      session,
      user: session?.user ?? null,
      loading: false,
    }),

  clearAuth: () =>
    set({
      session: null,
      user: null,
      loading: false,
    }),
}));
