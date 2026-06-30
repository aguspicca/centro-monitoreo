"use client";
import { useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useConfigStore } from "@/store/configStore";
import { useAuthStore } from "@/store/authStore";
import { CategoryData } from "@/types";
import { TicketModal } from "@/components/dashboard/TicketModal";
import { ConfigPanel } from "@/components/dashboard/ConfigPanel";
import { AnalyticsPanel } from "@/components/charts/AnalyticsPanel";

export default function OperativoPage() {
  const { config, useMockData } = useConfigStore();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"dashboard" | "analytics" | "config">("dashboard");
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [showAlert, setShowAlert] = useState(true);

  const { categories, summary, loading, error, refetch, lastUpdated, alert } = useDashboard();

  const tabs = [
    { id: "dashboard" as const, label: "Dashboard" },
    { id: "analytics" as const, label: "Analiticas" },
    { id: "config" as const, label: "Configuracion" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-grey-100)" }}>
      {/* Header */}
      <header style={{ background: "var(--color-white)", borderBottom: "1px solid var(--color-grey-300)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: 700, fontSize: "12px" }}>CM</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-grey-900)" }}>Centro de Monitoreo</span>
          </div>
          <nav style={{ display: "flex", gap: "4px" }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 500,
                  border: "none",
                  background: activeTab === t.id ? "var(--accent-dim)" : "transparent",
                  color: activeTab === t.id ? "var(--accent)" : "var(--color-grey-600)",
                  transition: "all var(--transition-base)",
                }}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: "var(--color-grey-500)" }} className="mono">
              {lastUpdated > 0 ? new Date(lastUpdated).toLocaleTimeString("es-AR") : "--:--:--"}
            </span>
            <button onClick={refetch} disabled={loading} className="btn-primary" style={{ fontSize: "12px" }}>
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
            <button onClick={logout} className="btn-secondary" style={{ fontSize: "12px" }}>
              Salir
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {activeTab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {error && (
              <div style={{ padding: "16px", background: "var(--red-bg)", border: "1px solid var(--red-border)", borderRadius: "8px" }}>
                <p style={{ fontSize: "13px", color: "var(--red)" }}>Error al cargar datos: {error.message}</p>
              </div>
            )}

            {alert.totalNewRed > 0 && showAlert && (
              <div className="animate-slide-down" style={{ padding: "16px", background: "var(--red-bg)", border: "1px solid var(--red-border)", borderRadius: "8px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ fontSize: "18px", lineHeight: "1.5" }}>⚠️</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--red)", marginBottom: "6px" }}>
                      Tickets vencidos detectados ({alert.totalNewRed} en total)
                    </h3>
                    <p style={{ fontSize: "12px", color: "var(--red)" }}>
                      {Object.entries(alert.newRedByCategory).map(([cat, count]) => `${cat}: ${count}`).join(" · ")}
                    </p>
                  </div>
                  <button onClick={() => setShowAlert(false)} style={{ background: "transparent", border: "none", fontSize: "16px", cursor: "pointer", color: "var(--red)" }}>✕</button>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
              <SummaryCard label="Total Tickets" value={summary.totalTickets} subtitle="en seguimiento" loading={loading} />
              <SummaryCard label="Vencidos" value={summary.redTickets} subtitle="requieren accion" highlight="critical" loading={loading} />
              <SummaryCard label="Por Vencer" value={summary.yellowTickets} subtitle="1-3 dias" highlight="warning" loading={loading} />
              <SummaryCard label="Saludables" value={summary.greenTickets} subtitle="a tiempo" highlight="success" loading={loading} />
              <SummaryCard label="Cumplimiento" value={`${summary.compliance}%`} subtitle="general" loading={loading} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} style={{ height: "240px", background: "var(--color-grey-200)", borderRadius: "12px" }} className="animate-pulse" />
                  ))
                : categories.map((cat) => (
                    <CategoryCard key={cat.id} category={cat} onClick={() => setSelectedCategory(cat)} />
                  ))
              }
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "24px", padding: "16px", borderTop: "1px solid var(--color-grey-300)", marginTop: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--color-grey-600)" }}>Semaforo:</span>
              <LegendItem color="var(--red)" label="Vencido" />
              <LegendItem color="var(--yellow)" label="Por vencer (1-3 dias)" />
              <LegendItem color="var(--green)" label="A tiempo (>3 dias)" />
              <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--color-grey-500)" }}>Auto-refresh cada 5 min</span>
            </div>
          </div>
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

function SummaryCard({ label, value, subtitle, highlight, loading }: {
  label: string; value: string | number; subtitle: string; highlight?: "critical" | "warning" | "success"; loading: boolean;
}) {
  const color = highlight === "critical" ? "var(--red)" : highlight === "warning" ? "var(--yellow)" : highlight === "success" ? "var(--green)" : "var(--color-grey-900)";
  return (
    <div className="transition-base" style={{ background: "var(--color-white)", border: "1px solid var(--color-grey-300)", borderRadius: "8px", padding: "16px", boxShadow: "var(--shadow-xs)" }}>
      <p style={{ fontSize: "12px", color: "var(--color-grey-600)", marginBottom: "6px" }}>{label}</p>
      {loading ? (
        <div style={{ height: "28px", width: "56px", background: "var(--color-grey-200)", borderRadius: "6px" }} className="animate-pulse" />
      ) : (
        <>
          <p style={{ fontSize: "28px", fontWeight: 700, color, marginBottom: "4px" }}>{value}</p>
          <p style={{ fontSize: "12px", color: "var(--color-grey-500)" }}>{subtitle}</p>
        </>
      )}
    </div>
  );
}

function CategoryCard({ category, onClick }: { category: CategoryData; onClick: () => void }) {
  const compliance = category.compliance;
  const complianceColor = compliance >= 90 ? "var(--green)" : compliance >= 70 ? "var(--yellow)" : "var(--red)";
  return (
    <button onClick={onClick} className="card-hover transition-base" style={{ background: "var(--color-white)", border: "1px solid var(--color-grey-300)", borderRadius: "12px", padding: "20px", textAlign: "left", boxShadow: "var(--shadow-xs)", cursor: "pointer", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-grey-900)" }}>{category.name}</h3>
        <span style={{ color: "var(--color-grey-400)" }}>→</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        <StatusRow color="var(--red)" bg="var(--red-bg)" label="Vencidos" count={category.red} />
        <StatusRow color="var(--yellow)" bg="var(--yellow-bg)" label="Por vencer" count={category.yellow} />
        <StatusRow color="var(--green)" bg="var(--green-bg)" label="A tiempo" count={category.green} />
      </div>
      <div style={{ paddingTop: "12px", borderTop: "1px solid var(--color-grey-200)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: "var(--color-grey-500)" }}>Total: {category.total}</span>
          <span style={{ fontSize: "14px", fontWeight: 700, color: complianceColor }}>{compliance}%</span>
        </div>
        <div style={{ height: "4px", background: "var(--color-grey-200)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${compliance}%`, background: complianceColor, transition: "width 0.8s" }} />
        </div>
      </div>
    </button>
  );
}

function StatusRow({ color, bg, label, count }: { color: string; bg: string; label: string; count: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "8px", background: bg }}>
      <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-grey-700)" }}>{label}</span>
      <span style={{ fontSize: "18px", fontWeight: 700, color }}>{count}</span>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
      <span style={{ fontSize: "12px", color: "var(--color-grey-600)" }}>{label}</span>
    </div>
  );
}
