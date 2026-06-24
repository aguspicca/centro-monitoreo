"use client";
import { DashboardSummary } from "@/types";
import { TrendingDown, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface Props { summary: DashboardSummary; loading: boolean; }

export function SummaryBar({ summary, loading }: Props) {
  const healthConfig = {
    healthy: { label: "Healthy", color: "var(--green)", bg: "var(--green-bg)", border: "var(--green-border)", icon: CheckCircle },
    "at-risk": { label: "At Risk", color: "var(--yellow)", bg: "var(--yellow-bg)", border: "var(--yellow-border)", icon: AlertTriangle },
    critical: { label: "Critical", color: "var(--red)", bg: "var(--red-bg)", border: "var(--red-border)", icon: TrendingDown },
  };
  const health = healthConfig[summary.healthStatus];
  const HealthIcon = health.icon;

  const stats = [
    { label: "Total Tickets", value: summary.totalTickets, color: "var(--text-primary)", sub: "en seguimiento" },
    { label: "Vencidos", value: summary.redTickets, color: "var(--red)", sub: "requieren acción" },
    { label: "Por Vencer", value: summary.yellowTickets, color: "var(--yellow)", sub: "1–3 días" },
    { label: "Saludables", value: summary.greenTickets, color: "var(--green)", sub: "a tiempo" },
    { label: "Cumplimiento", value: `${summary.compliance}%`, color: summary.compliance >= 90 ? "var(--green)" : summary.compliance >= 70 ? "var(--yellow)" : "var(--red)", sub: "general" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* Health card */}
      <div className="stat-card flex flex-col justify-between" style={{ borderColor: health.border, background: health.bg }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Estado General</p>
          <HealthIcon size={13} style={{ color: health.color }} />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: health.color, boxShadow: `0 0 6px ${health.color}` }} />
          <span className="text-base font-bold" style={{ color: health.color }}>{health.label}</span>
        </div>
      </div>

      {stats.map((s) => (
        <div key={s.label} className="stat-card flex flex-col justify-between">
          <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          {loading ? (
            <div className="skeleton h-8 w-14 mt-1" />
          ) : (
            <div>
              <p className="text-2xl font-bold mono leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{s.sub}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
