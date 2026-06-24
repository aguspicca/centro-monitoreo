"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";

export function LoginScreen() {
  const { login } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(username, password);
    if (!result.success) {
      setError(result.error || "Error al iniciar sesión");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)", boxShadow: "0 8px 32px rgba(37,99,235,0.3)" }}>
            <span className="text-white text-xl font-bold">CM</span>
          </div>
          <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Centro de Monitoreo</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Ingresá tus credenciales para continuar</p>
        </div>

        {/* Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                <User size={11} className="inline mr-1" />Usuario
              </label>
              <input
                type="text"
                placeholder="Tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                <Lock size={11} className="inline mr-1" />Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)", background: "none", border: "none" }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: "var(--red-bg)", color: "var(--red)", border: "1px solid var(--red-border)" }}>
                <AlertCircle size={13} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="btn-primary w-full py-2.5 mt-2"
              style={{ opacity: loading || !username || !password ? 0.6 : 1 }}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
          Centro de Monitoreo · Uso interno
        </p>
      </div>
    </div>
  );
}
