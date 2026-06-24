"use client";
import { RefreshCw, Settings, BarChart2, LayoutDashboard, Sun, Moon, Wifi, WifiOff, LogOut } from "lucide-react";
import { format } from "date-fns";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";

interface Props {
  activeTab: "dashboard" | "analytics" | "config";
  onTabChange: (tab: "dashboard" | "analytics" | "config") => void;
  onRefresh: () => void;
  loading: boolean;
  lastUpdated: number;
  isConnected: boolean;
  useMockData: boolean;
}

export function Header({ activeTab, onTabChange, onRefresh, loading, lastUpdated, isConnected, useMockData }: Props) {
  const { theme, toggleTheme } = useThemeStore();
  const { logout } = useAuthStore();

  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics" as const, label: "Analiticas", icon: BarChart2 },
    { id: "config" as const, label: "Configuracion", icon: Settings },
  ];

  return (
    <header style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)" }}>
              <span className="text-white text-xs font-bold">CM</span>
            </div>
            <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Centro de Monitoreo</span>
            {useMockData && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(245,158,11,0.1)", color: "var(--yellow)", border: "1px solid var(--yellow-border)" }}>DEMO</span>}
          </div>

          <nav className="flex items-center">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => onTabChange(t.id)} className="flex items-center gap-1.5 px-4 h-14 text-xs font-medium border-b-2 transition-all" style={{ color: active ? "var(--blue-light)" : "var(--text-muted)", borderBottomColor: active ? "var(--blue-light)" : "transparent", background: active ? "var(--blue-dim)" : "transparent" }}>
                  <Icon size={13} />{t.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
              {isConnected ? <Wifi size={11} style={{ color: "var(--green)" }} /> : <WifiOff size={11} style={{ color: "var(--red)" }} />}
              {lastUpdated > 0 && <span className="mono" style={{ color: "var(--text-muted)" }}>{format(new Date(lastUpdated), "HH:mm:ss")}</span>}
            </div>
            <button onClick={toggleTheme} className="btn-secondary p-2 rounded-lg" title="Cambiar tema">
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button onClick={onRefresh} disabled={loading} className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3">
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
            <button onClick={logout} className="btn-secondary p-2 rounded-lg" title="Cerrar sesión">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
