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
import { LoginScreen } from "@/components/auth/LoginScreen";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "analytics" | "config">("dashboard");
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const { config, useMockData } = useConfigStore();
  const { isAuthenticated } = useAuthStore();
  const { categories, summary, loading, error, refetch, lastUpdated, alert, dismissAlert } = useDashboard();

  if (!isAuthenticated) {
    return <LoginScreen />;
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
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Semáforo:</p>
              {[
                { color: "var(--red)", label: "Vencido (< 0 días)" },
                { color: "var(--yellow)", label: "Por vencer (1–3 días)" },
                { color: "var(--green)", label: "A tiempo (> 3 días)" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
                </div>
              ))}
              <div className="ml-auto text-xs mono" style={{ color: "var(--text-muted)" }}>
                Auto-refresh cada 5 min · Haz clic en una tarjeta para ver detalle
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
