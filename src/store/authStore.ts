"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,

      login: async (username, password) => {
        try {
          const response = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });
          const data = await response.json();
          if (data.success) {
            set({ isAuthenticated: true });
            return { success: true };
          }
          return { success: false, error: data.error };
        } catch (e: any) {
          return { success: false, error: e.message };
        }
      },

      logout: () => set({ isAuthenticated: false }),
    }),
    { name: "centro-monitoreo-auth" }
  )
);
