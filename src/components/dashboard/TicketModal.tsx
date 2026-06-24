"use client";
import { CategoryData, JiraTicket } from "@/types";
import { useState, useMemo } from "react";
import { X, Search, ExternalLink, User, Calendar, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props { category: CategoryData | null; onClose: () => void; jiraUrl?: string; }

const STATUS_ORDER = { red: 0, yellow: 1, green: 2 };
const PRIORITY_COLORS: Record<string, string> = {
  Highest: "var(--red)", High: "var(--yellow)", Medium: "var(--blue)", Low: "var(--text-muted)",
};

export function TicketModal({ category, onClose, jiraUrl }: Props) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "red" | "yellow" | "green">("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const sorted = useMemo(() => {
    if (!category) return [];
    return [...category.tickets]
      .filter((t) => {
        const matchSearch = !search || t.key.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()) || (t.assignee || "").toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "all" || t.ticketStatus === filterStatus;
        const matchPriority = filterPriority === "all" || t.priority === filterPriority;
        return matchSearch && matchStatus && matchPriority;
      })
      .sort((a, b) => STATUS_ORDER[a.ticketStatus] - STATUS_ORDER[b.ticketStatus]);
  }, [category, search, filterStatus, filterPriority]);

  if (!category) return null;

  const statusDot = (s: "red" | "yellow" | "green") => {
    const c = s === "red" ? "var(--red)" : s === "yellow" ? "var(--yellow)" : "var(--green)";
    return <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: c, boxShadow: `0 0 4px ${c}` }} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
      <div className="card w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden" style={{ borderColor: "var(--border)" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{category.name}</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{category.total} tickets · {sorted.length} mostrados</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge-red text-xs px-2 py-1 rounded-md mono">{category.red} vencidos</span>
            <span className="badge-yellow text-xs px-2 py-1 rounded-md mono">{category.yellow} por vencer</span>
            <span className="badge-green text-xs px-2 py-1 rounded-md mono">{category.green} a tiempo</span>
            <button onClick={onClose} className="btn-secondary p-2 ml-2"><X size={16} /></button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Buscar por clave, resumen o asignado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "32px" }}
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} style={{ width: "auto" }}>
            <option value="all">Todos los estados</option>
            <option value="red">🔴 Vencidos</option>
            <option value="yellow">🟡 Por vencer</option>
            <option value="green">🟢 A tiempo</option>
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ width: "auto" }}>
            <option value="all">Todas las prioridades</option>
            <option value="Highest">Highest</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2" style={{ color: "var(--text-muted)" }}>
              <AlertCircle size={24} />
              <p className="text-sm">Sin resultados</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Resumen</th>
                  <th>Asignado</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th>Due Date</th>
                  <th>Días</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((t) => (
                  <TicketRow key={t.id} ticket={t} jiraUrl={jiraUrl} statusDot={statusDot} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function TicketRow({ ticket, jiraUrl, statusDot }: { ticket: JiraTicket; jiraUrl?: string; statusDot: (s: any) => JSX.Element }) {
  const daysColor = ticket.ticketStatus === "red" ? "var(--red)" : ticket.ticketStatus === "yellow" ? "var(--yellow)" : "var(--green)";

  return (
    <tr>
      <td>
        {"https://divinf.atlassian.net" ? (
          <a href={`${jiraUrl}/browse/${ticket.key}`} target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-1 mono text-xs font-semibold hover:underline" style={{ color: "var(--blue)" }}>
            {ticket.key} <ExternalLink size={10} />
          </a>
        ) : (
          <span className="mono text-xs font-semibold" style={{ color: "var(--blue)" }}>{ticket.key}</span>
        )}
      </td>
      <td>
        <span className="line-clamp-2 text-xs" style={{ color: "var(--text-primary)", maxWidth: "300px" }}>{ticket.summary}</span>
      </td>
      <td>
        {ticket.assignee ? (
          <div className="flex items-center gap-1.5">
            <User size={11} style={{ color: "var(--text-muted)" }} />
            <span className="text-xs">{ticket.assignee}</span>
          </div>
        ) : (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Sin asignar</span>
        )}
      </td>
      <td>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
          {ticket.status}
        </span>
      </td>
      <td>
        <span className="text-xs font-medium" style={{ color: PRIORITY_COLORS[ticket.priority] || "var(--text-muted)" }}>
          {ticket.priority}
        </span>
      </td>
      <td>
        {ticket.dueDate ? (
          <div className="flex items-center gap-1">
            <Calendar size={11} style={{ color: "var(--text-muted)" }} />
            <span className="text-xs mono">{format(new Date(ticket.dueDate + "T00:00:00"), "dd/MM/yy")}</span>
          </div>
        ) : (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>SLA</span>
        )}
      </td>
      <td>
        <div className="flex items-center gap-1">
          {statusDot(ticket.ticketStatus)}
          <span className="text-sm font-bold mono" style={{ color: daysColor }}>
            {ticket.daysRemaining === null ? "—" : ticket.daysRemaining < 0 ? `${ticket.daysRemaining}d` : `+${ticket.daysRemaining}d`}
          </span>
        </div>
      </td>
    </tr>
  );
}

