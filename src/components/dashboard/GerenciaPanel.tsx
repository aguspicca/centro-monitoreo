"use client";
import { useState } from "react";
import { CategoryData } from "@/types";
import { FileText, Download, AlertTriangle, TrendingDown } from "lucide-react";

interface Props {
  categories: CategoryData[];
  loading: boolean;
}

export function GerenciaPanel({ categories, loading }: Props) {
  const [generating, setGenerating] = useState<string | null>(null);

  const areaConfig: Record<string, { label: string; color: string; emails: string }> = {
    "prescreening": { label: "Prescreening — Desarrollo", color: "#f43f5e", emails: "" },
    "escalamiento": { label: "Escalamiento — Gerencia", color: "#f59e0b", emails: "" },
    "mejoras-comercial": { label: "Tickets Priorizacion Comercial — Operaciones", color: "#7c6af7", emails: "" },
    "mejoras-areas": { label: "Tickets Priorizacion Areas — Operaciones", color: "#6366f1", emails: "" },
  };

  const redCategories = categories.filter(c => c.red > 0);
  const totalVencidos = categories.reduce((s, c) => s + c.red, 0);

  const generatePDF = async (categoryId: string) => {
    setGenerating(categoryId);
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) { setGenerating(null); return; }

    const area = areaConfig[categoryId] || { label: cat.name, color: "#f43f5e" };
    const vencidos = cat.tickets.filter((t: any) => t.ticketStatus === "red");
    const today = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Poppins', sans-serif; color: #0f0e2a; background: white; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #f0f0ff; }
  .logo-area h1 { font-size: 22px; font-weight: 700; color: #0f0e2a; }
  .logo-area p { font-size: 13px; color: #9290b8; margin-top: 2px; }
  .badge { background: ${area.color}18; border: 1px solid ${area.color}40; color: ${area.color}; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .meta { margin-bottom: 28px; }
  .meta h2 { font-size: 18px; font-weight: 700; color: #0f0e2a; margin-bottom: 4px; }
  .meta p { font-size: 13px; color: #9290b8; }
  .stats { display: flex; gap: 16px; margin-bottom: 32px; }
  .stat { flex: 1; padding: 16px 20px; border-radius: 12px; background: #f8f7ff; border: 1px solid #e8e6ff; }
  .stat .num { font-size: 28px; font-weight: 700; color: ${area.color}; }
  .stat .lbl { font-size: 11px; color: #9290b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  thead tr { background: ${area.color}10; }
  th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; color: #9290b8; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e8e6ff; }
  td { padding: 12px 14px; font-size: 13px; color: #4a4780; border-bottom: 1px solid #f0f0ff; }
  tr:last-child td { border-bottom: none; }
  .key { font-family: monospace; font-weight: 600; color: ${area.color}; font-size: 12px; }
  .days { font-weight: 700; color: #f43f5e; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #f0f0ff; display: flex; justify-content: space-between; }
  .footer p { font-size: 11px; color: #c0bde0; }
</style>
</head>
<body>
<div class="header">
  <div class="logo-area">
    <h1>Loan Software</h1>
    <p>Centro de Monitoreo — Informe Gerencial</p>
  </div>
  <div class="badge">${area.label}</div>
</div>

<div class="meta">
  <h2>Tickets Vencidos al ${today}</h2>
  <p>Informe generado automaticamente · Solo tickets con estado vencido</p>
</div>

<div class="stats">
  <div class="stat">
    <div class="num">${cat.red}</div>
    <div class="lbl">Tickets vencidos</div>
  </div>
  <div class="stat">
    <div class="num">${cat.yellow}</div>
    <div class="lbl">Por vencer (1-3 dias)</div>
  </div>
  <div class="stat">
    <div class="num" style="color:#059669">${cat.compliance}%</div>
    <div class="lbl">Cumplimiento</div>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>Clave</th>
      <th>Titulo</th>
      <th>Asignado</th>
      <th>Dias vencido</th>
      <th>Prioridad</th>
    </tr>
  </thead>
  <tbody>
    ${vencidos.map((t: any) => `
    <tr>
      <td><span class="key">${t.key}</span></td>
      <td>${t.summary}</td>
      <td>${t.assignee || "Sin asignar"}</td>
      <td><span class="days">${Math.abs(t.daysRemaining ?? 0)} dias</span></td>
      <td>${t.priority || "Media"}</td>
    </tr>`).join("")}
    ${vencidos.length === 0 ? '<tr><td colspan="5" style="text-align:center;color:#9290b8;padding:24px">Sin tickets vencidos</td></tr>' : ""}
  </tbody>
</table>

<div class="footer">
  <p>Loan Software · Centro de Monitoreo</p>
  <p>Generado el ${today}</p>
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => {
        setTimeout(() => { win.print(); }, 500);
      };
    }
    setGenerating(null);
  };

  const generateFullPDF = async () => {
    setGenerating("all");
    const today = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

    const sectionsHTML = categories.filter(c => c.red > 0).map(cat => {
      const area = areaConfig[cat.id] || { label: cat.name, color: "#f43f5e" };
      const vencidos = cat.tickets.filter((t: any) => t.ticketStatus === "red");
      return `
<div style="margin-bottom:40px;page-break-inside:avoid">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
    <div style="width:4px;height:32px;border-radius:2px;background:${area.color}"></div>
    <div>
      <h3 style="font-size:15px;font-weight:700;color:#0f0e2a">${area.label}</h3>
      <p style="font-size:12px;color:#9290b8">${cat.red} tickets vencidos · ${cat.compliance}% cumplimiento</p>
    </div>
  </div>
  <table style="width:100%;border-collapse:collapse">
    <thead>
      <tr style="background:${area.color}10">
        <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:600;color:#9290b8;text-transform:uppercase;border-bottom:1px solid #e8e6ff">Clave</th>
        <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:600;color:#9290b8;text-transform:uppercase;border-bottom:1px solid #e8e6ff">Titulo</th>
        <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:600;color:#9290b8;text-transform:uppercase;border-bottom:1px solid #e8e6ff">Asignado</th>
        <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:600;color:#9290b8;text-transform:uppercase;border-bottom:1px solid #e8e6ff">Dias vencido</th>
      </tr>
    </thead>
    <tbody>
      ${vencidos.map((t: any) => `
      <tr>
        <td style="padding:10px 12px;font-size:12px;font-family:monospace;font-weight:600;color:${area.color};border-bottom:1px solid #f0f0ff">${t.key}</td>
        <td style="padding:10px 12px;font-size:12px;color:#4a4780;border-bottom:1px solid #f0f0ff">${t.summary}</td>
        <td style="padding:10px 12px;font-size:12px;color:#4a4780;border-bottom:1px solid #f0f0ff">${t.assignee || "Sin asignar"}</td>
        <td style="padding:10px 12px;font-size:12px;font-weight:700;color:#f43f5e;border-bottom:1px solid #f0f0ff">${Math.abs(t.daysRemaining ?? 0)} dias</td>
      </tr>`).join("")}
    </tbody>
  </table>
</div>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Poppins', sans-serif; color: #0f0e2a; background: white; padding: 40px; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #f0f0ff">
  <div>
    <h1 style="font-size:22px;font-weight:700;color:#0f0e2a">Loan Software</h1>
    <p style="font-size:13px;color:#9290b8;margin-top:2px">Centro de Monitoreo — Informe Gerencial Completo</p>
  </div>
  <div style="text-align:right">
    <p style="font-size:13px;font-weight:600;color:#0f0e2a">${today}</p>
    <p style="font-size:12px;color:#9290b8">${totalVencidos} tickets vencidos en total</p>
  </div>
</div>

<div style="display:flex;gap:16px;margin-bottom:32px">
  ${categories.map(c => {
    const area = areaConfig[c.id] || { label: c.name, color: "#f43f5e" };
    return `<div style="flex:1;padding:14px 16px;border-radius:10px;background:#f8f7ff;border:1px solid #e8e6ff">
      <div style="font-size:20px;font-weight:700;color:${area.color}">${c.red}</div>
      <div style="font-size:10px;color:#9290b8;margin-top:2px">${c.name}</div>
    </div>`;
  }).join("")}
</div>

${sectionsHTML}

<div style="margin-top:40px;padding-top:16px;border-top:1px solid #f0f0ff;display:flex;justify-content:space-between">
  <p style="font-size:11px;color:#c0bde0">Loan Software · Centro de Monitoreo</p>
  <p style="font-size:11px;color:#c0bde0">Generado el ${today}</p>
</div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) win.onload = () => setTimeout(() => win.print(), 500);
    setGenerating(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => <div key={i} className="card p-6"><div className="skeleton h-6 w-48 mb-4" /><div className="skeleton h-32 w-full" /></div>)}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>Panel Gerencial</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>Solo tickets vencidos · Descargá informes por área</p>
        </div>
        <button
          onClick={generateFullPDF}
          disabled={generating === "all"}
          className="btn-primary flex items-center gap-2"
        >
          <Download size={14} />
          {generating === "all" ? "Generando..." : "Informe completo PDF"}
        </button>
      </div>

      {totalVencidos === 0 ? (
        <div className="card p-12 text-center">
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
          <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>Sin tickets vencidos</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Todas las areas estan al dia</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.filter(c => c.red > 0).map(cat => {
            const area = areaConfig[cat.id] || { label: cat.name, color: "#f43f5e" };
            const vencidos = cat.tickets.filter((t: any) => t.ticketStatus === "red");
            return (
              <div key={cat.id} className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div style={{ width: "4px", height: "36px", borderRadius: "2px", background: area.color, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>{area.label}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "1px" }}>
                        <span style={{ color: area.color, fontWeight: 600 }}>{cat.red} vencidos</span> · {cat.compliance}% cumplimiento
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => generatePDF(cat.id)}
                    disabled={generating === cat.id}
                    className="btn-secondary flex items-center gap-2"
                    style={{ fontSize: "12px" }}
                  >
                    <FileText size={13} />
                    {generating === cat.id ? "Generando..." : "Descargar PDF"}
                  </button>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border)" }}>Clave</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border)" }}>Titulo</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border)" }}>Asignado</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border)" }}>Dias vencido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vencidos.slice(0, 5).map((t: any) => (
                      <tr key={t.id}>
                        <td style={{ padding: "10px 12px", fontSize: "12px", fontFamily: "monospace", fontWeight: 600, color: area.color, borderBottom: "1px solid var(--border-subtle)" }}>{t.key}</td>
                        <td style={{ padding: "10px 12px", fontSize: "12px", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)", maxWidth: "300px" }}>{t.summary}</td>
                        <td style={{ padding: "10px 12px", fontSize: "12px", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)" }}>{t.assignee || "Sin asignar"}</td>
                        <td style={{ padding: "10px 12px", fontSize: "12px", fontWeight: 700, color: "var(--red)", borderBottom: "1px solid var(--border-subtle)" }}>{Math.abs(t.daysRemaining ?? 0)} dias</td>
                      </tr>
                    ))}
                    {vencidos.length > 5 && (
                      <tr>
                        <td colSpan={4} style={{ padding: "10px 12px", fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
                          +{vencidos.length - 5} tickets mas en el PDF
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
