"use client";
import { AlertState } from "@/types";
import { X, AlertTriangle } from "lucide-react";

interface Props { alert: AlertState; onDismiss: () => void; }

export function AlertBanner({ alert, onDismiss }: Props) {
  if (!alert.visible || alert.totalNewRed === 0) return null;

  return (
    <div className="alert-banner p-4 mb-4 flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <AlertTriangle size={18} style={{ color: "var(--red)" }} />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm mb-1" style={{ color: "var(--red)" }}>
          ⚠️ Nuevos tickets vencidos detectados ({alert.totalNewRed} nuevo{alert.totalNewRed !== 1 ? "s" : ""})
        </p>
        <div className="flex flex-wrap gap-3 mt-1">
          {Object.entries(alert.newRedByCategory).map(([cat, count]) => (
            <span key={cat} className="text-xs mono" style={{ color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--red)" }}>●</span> {cat}: <strong style={{ color: "var(--text-primary)" }}>{count}</strong>
            </span>
          ))}
        </div>
      </div>
      <button onClick={onDismiss} className="btn-secondary p-1.5 border-0 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}
