"use client";
import { useState } from "react";
import { useConfigStore } from "@/store/configStore";
import { testJiraConnection } from "@/lib/jira";
import { JiraConfig, CategoryConfig } from "@/types";
import { CheckCircle, XCircle, Loader2, Save, RotateCcw, Link, Key, User, Database, Volume2, VolumeX } from "lucide-react";

export function ConfigPanel() {
  const { config, isConfigured, useMockData, setJiraConfig, setCategories, setSoundEnabled, setUseMockData, resetConfig } = useConfigStore();
  const [form, setForm] = useState<JiraConfig>(config.jira);
  const [cats, setCats] = useState<CategoryConfig[]>(config.categories);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleTest() {
    setTesting(true); setTestResult(null);
    const r = await testJiraConnection(form);
    setTestResult({ success: r.success, message: r.success ? `Conectado como: ${r.user}` : r.error || "Error" });
    setTesting(false);
  }

  function handleSave() {
    setJiraConfig(form);
    setCategories(cats);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      {/* Mock Data Toggle */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Modo de datos</h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Usa datos de demostración sin necesitar conexión a Jira</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: useMockData ? "var(--blue)" : "var(--text-muted)" }}>
              {useMockData ? "📊 Datos mock" : "🔗 Jira real"}
            </span>
            <button
              onClick={() => setUseMockData(!useMockData)}
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{ background: useMockData ? "var(--blue)" : "var(--border)" }}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${useMockData ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Jira Config */}
      <div className="card p-5">
        <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Conexión Jira</h3>
        <div className="space-y-3">
          <label className="block">
            <div className="flex items-center gap-1.5 mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
              <Link size={11} /> URL de Jira
            </div>
            <input type="url" placeholder="https://tu-empresa.atlassian.net" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </label>
          <label className="block">
            <div className="flex items-center gap-1.5 mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
              <User size={11} /> Email
            </div>
            <input type="email" placeholder="usuario@empresa.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="block">
            <div className="flex items-center gap-1.5 mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
              <Key size={11} /> API Token
            </div>
            <input type="password" placeholder="Tu API token de Jira" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} />
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              Generalo en{" "}
              <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--blue)" }}>
                id.atlassian.com/manage-profile/security/api-tokens
              </a>
            </p>
          </label>
          <label className="block">
            <div className="flex items-center gap-1.5 mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
              <Database size={11} /> SLA por defecto (días)
            </div>
            <input type="number" min={1} max={30} value={form.slaDefaultDays} onChange={(e) => setForm({ ...form, slaDefaultDays: parseInt(e.target.value) || 5 })} style={{ width: "120px" }} />
          </label>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button onClick={handleTest} disabled={testing || !form.url || !form.email || !form.token} className="btn-secondary flex items-center gap-2 text-sm">
            {testing ? <Loader2 size={14} className="animate-spin" /> : null}
            Probar conexión
          </button>
          {testResult && (
            <div className={`flex items-center gap-1.5 text-xs ${testResult.success ? "" : ""}`} style={{ color: testResult.success ? "var(--green)" : "var(--red)" }}>
              {testResult.success ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {testResult.message}
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="card p-5">
        <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Categorías y consultas JQL</h3>
        <div className="space-y-4">
          {cats.map((cat, i) => (
            <div key={cat.id} className="p-3 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-2">
                <input
                  className="text-sm font-semibold"
                  style={{ background: "transparent", border: "none", color: "var(--text-primary)", width: "auto", padding: "0" }}
                  value={cat.name}
                  onChange={(e) => setCats(cats.map((c, j) => j === i ? { ...c, name: e.target.value } : c))}
                />
                <button
                  onClick={() => setCats(cats.map((c, j) => j === i ? { ...c, enabled: !c.enabled } : c))}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    background: cat.enabled ? "var(--green-bg)" : "var(--bg-card)",
                    color: cat.enabled ? "var(--green)" : "var(--text-muted)",
                    border: `1px solid ${cat.enabled ? "var(--green-border)" : "var(--border)"}`,
                  }}
                >
                  {cat.enabled ? "Activa" : "Inactiva"}
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="project = KEY AND status != Done ORDER BY created DESC"
                value={cat.jql}
                onChange={(e) => setCats(cats.map((c, j) => j === i ? { ...c, jql: e.target.value } : c))}
                style={{ fontSize: "12px", fontFamily: "var(--font-mono, monospace)", resize: "vertical" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sound */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.soundEnabled ? <Volume2 size={16} style={{ color: "var(--blue)" }} /> : <VolumeX size={16} style={{ color: "var(--text-muted)" }} />}
            <div>
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Alertas sonoras</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Sonido al detectar nuevos tickets vencidos</p>
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!config.soundEnabled)}
            className="relative w-11 h-6 rounded-full transition-colors"
            style={{ background: config.soundEnabled ? "var(--blue)" : "var(--border)" }}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${config.soundEnabled ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          {saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? "Guardado" : "Guardar configuración"}
        </button>
        <button onClick={resetConfig} className="btn-secondary flex items-center gap-2 text-sm">
          <RotateCcw size={13} /> Restablecer
        </button>
      </div>
    </div>
  );
}
