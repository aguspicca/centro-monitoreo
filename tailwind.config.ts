import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: { primary: "#0a0d14", secondary: "#111827", card: "#141b2d", border: "#1e2a3a" },
        accent: { red: "#ef4444", yellow: "#f59e0b", green: "#22c55e", blue: "#3b82f6", purple: "#8b5cf6" },
        text: { primary: "#f1f5f9", secondary: "#94a3b8", muted: "#64748b" }
      },
      fontFamily: { mono: ["JetBrains Mono", "Fira Code", "monospace"] },
      animation: { "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite" }
    }
  },
  plugins: []
};
export default config;
