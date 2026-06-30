"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  role: "operativo" | "gerencial" | null;
  user: { username: string; email: string } | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: null,
      user: null,
      loading: false,
      error: null,
      login: async (username: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });
          const data = await response.json();
          if (data.success) {
            set({ isAuthenticated: true, role: data.role, user: data.user, loading: false, error: null });
          } else {
            set({ isAuthenticated: false, role: null, user: null, loading: false, error: data.error || "Error de autenticacion" });
            throw new Error(data.error || "Credenciales invalidas");
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Error de conexion";
          set({ isAuthenticated: false, role: null, user: null, loading: false, error: errorMessage });
          throw error;
        }
      },
      logout: () => {
        set({ isAuthenticated: false, role: null, user: null, loading: false, error: null });
      },
      clearError: () => set({ error: null }),
    }),
    { name: "centro-monitoreo-auth" }
  )
);
