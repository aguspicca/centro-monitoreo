"use client";
import { CategoryData } from "@/types";
import { AlertCircle, ChevronRight, TrendingDown } from "lucide-react";

interface Props { category: CategoryData; loading: boolean; onClick: () => void; }

export function CategoryCard({ category, loading, onClick }: Props) {
  const complianceColor =
    category.compliance >= 90 ? "var(--green)"
    : category.compliance >= 70 ? "var(--yellow)"
    : "var(--red)";

  const accentColor =
    category.red > 0 && category.compliance < 70 ? "var(--red-border)"
    : category.yellow > 0 ? "var(--yellow-border)"
    : "var(--green-border)";

  if (loading) {
    return (
      <div className="card p-5">
        <div className="skeleton h-4 w-28 mb-5" />
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="skeleton h-12 w-full" />)}
        </div>
        <div className="skeleton h-3 w-full mt-4" />
      </div>
    );
  }

  return (
    <button onClick={onClick} className="card card-hover w-full text-left p-5 relative overflow-hidden group">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl transition-all" style={{ background: accentColor }} />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{category.name}</h3>
        <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" style={{ color: "var(--text-muted)" }} />
      </div>

      {/* Error */}
      {category.error && (
        <div className="flex items-center gap-1.5 text-xs mb-3 p-2 rounded-lg" style={{ background: "var(--red-bg)", color: "var(--red)" }}>
          <AlertCircle size={11} />
          <span className="truncate">{category.error}</span>
        </div>
      )}

      {/* Traffic light rows */}
      <div className="space-y-2 mb-4">
        <TrafficRow color="var(--red)" bg="var(--red-bg)" border="var(--red-border)" label="Vencidos" count={category.red} />
        <TrafficRow color="var(--yellow)" bg="var(--yellow-bg)" border="var(--yellow-border)" label="Por vencer" count={category.yellow} />
        <TrafficRow color="var(--green)" bg="var(--green-bg)" border="var(--green-border)" label="A tiempo" count={category.green} />
      </div>

      {/* Footer */}
      <div className="pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Total: <span className="font-semibold mono" style={{ color: "var(--text-secondary)" }}>{category.total}</span>
          </span>
          <span className="text-sm font-bold mono" style={{ color: complianceColor }}>{category.compliance}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${category.compliance}%`, background: complianceColor }} />
        </div>
      </div>
    </button>
  );
}

function TrafficRow({ color, bg, border, label, count }: {
  color: string; bg: string; border: string; label: string; count: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
        <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{label}</span>
      </div>
      <span className="text-xl font-bold mono" style={{ color }}>{count}</span>
    </div>
  );
}
