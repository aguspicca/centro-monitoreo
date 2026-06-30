"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

interface BarreraData { id: string; title: string; description: string; severity: string; count: number; lastUpdated: string; }
interface EscalamientoData { id: string; title: string; description: string; type: string; severity: string; assignedTo: string; status: string; createdAt: string; ticketKey?: string; }
interface AgendaItemData { id: string; title: string; description: string; severity: string; time?: string; }

export default function GerencialPage() {
  const { user, logout } = useAuthStore();
  const [barreras, setBarreras] = useState<BarreraData[]>([]);
  const [escalamientosClientes, setEscalamientosClientes] = useState<EscalamientoData[]>([]);
  const [escalamientosInternos, setEscalamientosInternos] = useState<EscalamientoData[]>([]);
  const [agendaItems, setAgendaItems] = useState<AgendaItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockBarreras: BarreraData[] = [
          { id: "barrera-1", title: "Critico", description: "Accion inmediata", severity: "critico", count: 2, lastUpdated: new Date().toISOString() },
          { id: "barrera-2", title: "Urgente hoy", description: "Recuperar antes del cliente", severity: "urgente", count: 1, lastUpdated: new Date().toISOString() },
          { id: "barrera-3", title: "Media", description: "Requiere definicion", severity: "media", count: 0, lastUpdated: new Date().toISOString() },
          { id: "barrera-4", title: "A definir esta semana", description: "En urgencia inmediata", severity: "baja", count: 0, lastUpdated: new Date().toISOString() },
        ];

        const mockEscalamientosClientes: EscalamientoData[] = [
          { id: "esc-cliente-1", title: "Cliente a la espera de bajada de version", description: "El cliente esta bloqueado por un bug critico en produccion. Requiere la correccion en la proxima bajada de version con urgencia.", type: "cliente", severity: "urgente", assignedTo: "Juan M. (PO)", status: "a-gestionar", createdAt: new Date().toISOString(), ticketKey: "CAT-123" },
          { id: "esc-cliente-2", title: "Credencial faltante - SISA", description: "Config de dominio/proveedor pendiente post-migracion Finanza. Sin esto no puede go-live el cliente.", type: "cliente", severity: "critico", assignedTo: "Cecilia R. - Operaciones", status: "a-gestionar", createdAt: new Date().toISOString() },
          { id: "esc-cliente-3", title: "Recurso sin asignacion nueva - Cisneros", description: "Paquetes anteriores sin cerrar bloqueo toda nueva tarea. Recurso liberado sin nada para hacer.", type: "cliente", severity: "critico", assignedTo: "Juan M. + Ceci R.", status: "gestionado", createdAt: new Date().toISOString() },
        ];

        const mockEscalamientosInternos: EscalamientoData[] = [
          { id: "esc-interno-1", title: "Escalamiento interno 1", description: "Descripcion del escalamiento interno.", type: "interno", severity: "media", assignedTo: "Equipo Dev", status: "nueva", createdAt: new Date().toISOString() },
        ];

        const mockAgendaItems: AgendaItemData[] = [
          { id: "agenda-1", title: "Visita presencial - Credito Directo", description: "Se solicita visita al cliente para revisar estado de implementacion y operatoria de creditos. Coordinar fecha con Comercial y llevar estado actualizado del paquete.", severity: "critico", time: "14:00" },
          { id: "agenda-2", title: "Visita presencial - Cristal Cash", description: "Reunion de entrega comercial con el cliente. Presentar propuesta de valor y alinear proximos pasos del paquete activo.", severity: "urgente", time: "16:30" },
        ];

        setBarreras(mockBarreras);
        setEscalamientosClientes(mockEscalamientosClientes);
        setEscalamientosInternos(mockEscalamientosInternos);
        setAgendaItems(mockAgendaItems);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critico": return "var(--red)";
      case "urgente": return "var(--yellow)";
      case "media": return "var(--color-brand-azul-600)";
      case "baja": return "var(--color-grey-600)";
      default: return "var(--color-grey-600)";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "critico": return "var(--red-bg)";
      case "urgente": return "var(--yellow-bg)";
      case "media": return "rgba(37, 99, 235, 0.08)";
      case "baja": return "var(--color-grey-200)";
      default: return "var(--color-grey-200)";
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-grey-100)" }}>
      <header style={{ background: "var(--color-white)", borderBottom: "1px solid var(--color-grey-300)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: 700, fontSize: "12px" }}>CM</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-grey-900)" }}>Centro de Monitoreo</span>
            <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent-border)", fontWeight: 600 }}>Gerencial</span>
          </div>
          <button onClick={logout} className="btn-secondary" style={{ fontSize: "12px" }}>Cerrar sesion</button>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--color-grey-900)", marginBottom: "4px" }}>
              Buenos dias, {user?.username || "Gerente"} 👋
            </h1>
            <p style={{ fontSize: "13px", color: "var(--color-grey-600)" }}>
              {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} · Monitor gerencial
            </p>
          </div>

          {escalamientosClientes.length + escalamientosInternos.length > 0 && (
            <div className="animate-slide-down" style={{ padding: "12px 16px", background: "var(--red-bg)", border: "1px solid var(--red-border)", borderRadius: "8px" }}>
              <p style={{ fontSize: "13px", color: "var(--red)" }}>
                ⚠️ {escalamientosClientes.length + escalamientosInternos.length} escalamientos activos requieren tu atencion. {escalamientosClientes.length} de clientes · {escalamientosInternos.length} internos.
              </p>
            </div>
          )}

          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-grey-900)", marginBottom: "12px" }}>🚧 BARRERAS ACTIVAS — RESUMEN</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ height: "100px", background: "var(--color-grey-200)", borderRadius: "8px" }} className="animate-pulse" />)
                : barreras.map((b) => (
                    <div key={b.id} style={{ background: "var(--color-white)", border: `2px solid ${getSeverityColor(b.severity)}`, borderRadius: "8px", padding: "16px", boxShadow: "var(--shadow-xs)" }}>
                      <p style={{ fontSize: "28px", fontWeight: 700, color: getSeverityColor(b.severity) }}>{b.count}</p>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-grey-900)" }}>{b.title}</p>
                      <p style={{ fontSize: "12px", color: "var(--color-grey-600)" }}>{b.description}</p>
                    </div>
                  ))
              }
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-grey-900)", marginBottom: "12px" }}>👥 ESCALAMIENTOS DE CLIENTES · {escalamientosClientes.length}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {loading
                ? Array.from({ length: 2 }).map((_, i) => <div key={i} style={{ height: "80px", background: "var(--color-grey-200)", borderRadius: "8px" }} className="animate-pulse" />)
                : escalamientosClientes.map((esc) => (
                    <EscalamientoCard key={esc.id} item={esc} isExpanded={expandedItem === esc.id} onToggle={() => setExpandedItem(expandedItem === esc.id ? null : esc.id)} getSeverityColor={getSeverityColor} getSeverityBg={getSeverityBg} />
                  ))
              }
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-grey-900)", marginBottom: "12px" }}>🔧 ESCALAMIENTOS INTERNOS · {escalamientosInternos.length}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {escalamientosInternos.map((esc) => (
                <EscalamientoCard key={esc.id} item={esc} isExpanded={expandedItem === esc.id} onToggle={() => setExpandedItem(expandedItem === esc.id ? null : esc.id)} getSeverityColor={getSeverityColor} getSeverityBg={getSeverityBg} />
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-grey-900)", marginBottom: "12px" }}>📅 AGENDA PROPUESTA DEL DIA</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {agendaItems.map((item) => (
                <div key={item.id} style={{ background: "var(--color-white)", border: `1px solid ${getSeverityColor(item.severity)}`, borderRadius: "8px", padding: "16px", boxShadow: "var(--shadow-xs)", borderLeft: `4px solid ${getSeverityColor(item.severity)}` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div style={{ padding: "6px 8px", background: getSeverityBg(item.severity), borderRadius: "4px", fontSize: "12px", fontWeight: 600, color: getSeverityColor(item.severity), whiteSpace: "nowrap" }}>
                      {item.time ? `${item.time} hs` : item.severity}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-grey-900)" }}>{item.title}</p>
                      <p style={{ fontSize: "12px", color: "var(--color-grey-600)", marginTop: "4px" }}>{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function EscalamientoCard({ item, isExpanded, onToggle, getSeverityColor, getSeverityBg }: {
  item: EscalamientoData; isExpanded: boolean; onToggle: () => void; getSeverityColor: (s: string) => string; getSeverityBg: (s: string) => string;
}) {
  return (
    <div onClick={onToggle} className="transition-base" style={{ background: "var(--color-white)", border: "1px solid var(--color-grey-300)", borderRadius: "8px", padding: "16px", cursor: "pointer", borderLeft: `4px solid ${getSeverityColor(item.severity)}`, boxShadow: "var(--shadow-xs)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <span style={{ fontSize: "14px", marginTop: "2px" }}>{isExpanded ? "▼" : "▶"}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-grey-900)" }}>{item.title}</p>
            <span style={{ padding: "2px 8px", background: getSeverityBg(item.severity), color: getSeverityColor(item.severity), fontSize: "11px", fontWeight: 600, borderRadius: "4px" }}>
              {item.severity === "critico" ? "Critico" : item.severity === "urgente" ? "Urgente hoy" : item.severity === "media" ? "Media" : "Baja"}
            </span>
          </div>

          {isExpanded && (
            <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--color-grey-300)", fontSize: "13px", color: "var(--color-grey-700)", lineHeight: 1.5 }}>
              <p style={{ marginBottom: "12px" }}>{item.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px" }}>
                <div>
                  <p style={{ color: "var(--color-grey-600)", marginBottom: "2px" }}>GESTION ASIGNADA</p>
                  <p style={{ fontWeight: 500 }}>{item.assignedTo}</p>
                </div>
                <div>
                  <p style={{ color: "var(--color-grey-600)", marginBottom: "2px" }}>TICKET</p>
                  <p style={{ fontWeight: 500, color: "var(--color-brand-azul-600)" }}>{item.ticketKey || "—"}</p>
                </div>
                <div>
                  <p style={{ color: "var(--color-grey-600)", marginBottom: "2px" }}>ESTADO</p>
                  <p style={{ fontWeight: 500 }}>{item.status === "nueva" ? "Nueva" : item.status === "a-gestionar" ? "A gestionar" : "Gestionado"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
