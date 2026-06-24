"use client";
import { generateMockHistory } from "@/lib/mockData";
import { CategoryData } from "@/types";
import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface Props { categories: CategoryData[]; }

const TOOLTIP_STYLE = {
  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  color: "var(--text-primary)",
  fontSize: "12px",
};

export function AnalyticsPanel({ categories }: Props) {
  const history = useMemo(() => generateMockHistory(14), []);
  const weeklyData = useMemo(() => generateMockHistory(7), []);

  const categoryTotals = categories.map((c) => ({
    name: c.name.replace("Mejoras ", "M."),
    Vencidos: c.red,
    "Por vencer": c.yellow,
    "A tiempo": c.green,
  }));

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Analíticas</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trend of overdue */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>Evolución de tickets vencidos (14 días)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="red" name="Vencidos" stroke="#ef4444" fill="rgba(239,68,68,0.15)" strokeWidth={2} />
              <Area type="monotone" dataKey="yellow" name="Por vencer" stroke="#f59e0b" fill="rgba(245,158,11,0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance trend */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>Cumplimiento diario (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickFormatter={(v) => v.slice(5)} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [`${v}%`, "Cumplimiento"]} />
              <Line type="monotone" dataKey="compliance" name="Cumplimiento" stroke="#22c55e" strokeWidth={2} dot={false} />
              {/* Thresholds */}
              <Line type="monotone" dataKey={() => 90} stroke="rgba(34,197,94,0.3)" strokeDasharray="4 4" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey={() => 70} stroke="rgba(245,158,11,0.3)" strokeDasharray="4 4" strokeWidth={1} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* By category */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>Tickets por categoría</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryTotals}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "var(--text-muted)" }} />
              <Bar dataKey="Vencidos" fill="#ef4444" radius={[2,2,0,0]} />
              <Bar dataKey="Por vencer" fill="#f59e0b" radius={[2,2,0,0]} />
              <Bar dataKey="A tiempo" fill="#22c55e" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly compliance */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>Evolución semanal (tickets totales)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="total" name="Total" stroke="#3b82f6" fill="rgba(59,130,246,0.15)" strokeWidth={2} />
              <Area type="monotone" dataKey="green" name="A tiempo" stroke="#22c55e" fill="rgba(34,197,94,0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
