"use client";
import { useAuthStore } from "@/store/authStore";
import { LoginScreen } from "@/components/auth/LoginScreen";
import OperativoPage from "./dashboard/operativo/page";
import GerencialPage from "./dashboard/gerencial/page";

export default function Home() {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) return <LoginScreen />;
  if (role === "gerencial") return <GerencialPage />;
  return <OperativoPage />;
}
