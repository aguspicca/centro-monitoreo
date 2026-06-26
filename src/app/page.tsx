"use client";
import { useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useConfigStore } from "@/store/configStore";
import { useAuthStore } from "@/store/authStore";
import { CategoryData } from "@/types";
import { Header } from "@/components/dashboard/Header";
import { SummaryBar } from "@/components/dashboard/SummaryBar";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { TicketModal } from "@/components/dashboard/TicketModal";
import { ConfigPanel } from "@/components/dashboard/ConfigPanel";
import { AlertBanner } from "@/components/alerts/AlertBanner";
import { AnalyticsPanel } from "@/components/charts/AnalyticsPanel";
import { GerenciaPanel } from "@/components/dashboard/GerenciaPanel";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "analytics" | "config">("dashboard");
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const { config, useMockData } = useConfigStore();
  const { isAuthenticated, role } = useAuthStore();
  const { categories, summary, loading, error, refetch, lastUpdated, alert, dismissAlert } = useDashboard();

  if (!isAuthenticated) return <LoginScreen />;

  // Si es gerencia, mostrar solo panel gerencial
  if (role === "gerencia") {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", padding: "0 24px" }}>
          <div className="max-w-screen-2xl mx-auto flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c6af7, #5b8def)" }}>
                <span className="text-white text-xs font-bold">CM</span>
              </div>
              <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Centro de Monitoreo</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>Gerencia</span>
            </div>
            <button
              onClick={() => useAuthStore.getState().logout()}
              className="btn-secondary text-xs py-1.5"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
        <main className="max-w-screen-2xl mx-auto px-6 py-6">
          <GerenciaPanel categories={categories} loading={loading} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={refetch}
        loading={loading}
        lastUpdated={lastUpdated}
        isConnected={!error}
        useMockData={useMockData}
      />

      <main className="max-w-screen-2xl mx-auto px-6 py-6">
        {error && activeTab !== "config" && (
          <div className="flex items-center gap-3 p-4 rounded-lg mb-4" style={{ background: "var(--red-bg)", border: "1px solid var(--red-border)" }}>
            <AlertCircle size={16} style={{ color: "var(--red)" }} />
            <p className="text-sm" style={{ color: "var(--red)" }}>Error al cargar datos: {error.message}</p>
          </div>
        )}

        {activeTab === "dashboard" && <AlertBanner alert={alert} onDismiss={dismissAlert} />}

        {activeTab === "dashboard" && (
          <>
            <SummaryBar summary={summary} loading={loading} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="card p-5">
                      <div className="skeleton h-5 w-32 mb-4" />
                      <div className="space-y-2">
                        {[1,2,3].map(j => <div key={j} className="skeleton h-10 w-full" />)}
                      </div>
                    </div>
                  ))
                : categories.map((cat) => (
                    <CategoryCard key={cat.id} category={cat} loading={false} onClick={() => setSelectedCategory(cat)} />
                  ))
              }
            </div>
            <div className="flex items-center gap-6 mt-6 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Semaforo:</p>
              {[
                { color: "var(--red)", label: "Vencido (< 0 dias)" },
                { color: "var(--yellow)", label: "Por vencer (1-3 dias)" },
                { color: "var(--green)", label: "A tiempo (> 3 dias)" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
                </div>
              ))}
              <div className="ml-auto text-xs mono" style={{ color: "var(--text-muted)" }}>
                Auto-refresh cada 5 min
              </div>
            </div>
          </>
        )}

        {activeTab === "analytics" && <AnalyticsPanel categories={categories} />}
        {activeTab === "config" && <ConfigPanel />}
      </main>

      {selectedCategory && (
        <TicketModal category={selectedCategory} onClose={() => setSelectedCategory(null)} jiraUrl={config.jira.url} />
      )}
    </div>
  );
}
