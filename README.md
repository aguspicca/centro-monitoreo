# Centro de Monitoreo

Dashboard ejecutivo para seguimiento de tickets Jira con semáforo operativo en tiempo real.

## Stack

- **Next.js 15** · App Router
- **React 18 + TypeScript**
- **TailwindCSS** · Dark mode nativo
- **@tanstack/react-query** · Fetching + auto-refresh
- **@tanstack/react-table** · Tablas avanzadas
- **Recharts** · Gráficos analíticos
- **Zustand** · Estado global + persistencia local
- **Jira REST API v3**

---

## Instalación local

```bash
# 1. Clonar / descomprimir el proyecto
cd centro-monitoreo

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (opcional)
cp .env.example .env.local

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:3000
```

---

## Configuración de Jira

1. Accede a **Configuración** en el menú superior
2. Ingresa:
   - **URL de Jira**: `https://tu-empresa.atlassian.net`
   - **Email**: tu correo de Jira
   - **API Token**: generalo en [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
3. Haz clic en **Probar conexión** para verificar
4. Personaliza las consultas JQL por categoría
5. Guarda la configuración

> La configuración se guarda en `localStorage`, no en el servidor.

---

## Modo Demo (Mock Data)

Sin configurar Jira, la aplicación carga automáticamente datos de demostración.  
Activa/desactiva en **Configuración → Modo de datos**.

---

## Lógica del semáforo

| Color | Criterio |
|-------|----------|
| 🔴 Rojo | Ticket vencido (daysRemaining < 0) |
| 🟡 Amarillo | 1–3 días para vencer |
| 🟢 Verde | Más de 3 días |

**Fecha de referencia:**
- Si el ticket tiene `Due Date` → se usa esa fecha
- Si no → `Fecha de creación + SLA configurable (default: 5 días)`

---

## Despliegue en Vercel

```bash
# Opción 1: Vercel CLI
npm i -g vercel
vercel

# Opción 2: GitHub
# 1. Subir el proyecto a GitHub
# 2. Importar en vercel.com/new
# 3. Framework: Next.js (auto-detectado)
# 4. Agregar variables de entorno si se desea pre-configurar Jira
# 5. Deploy
```

**Variables de entorno en Vercel** (opcionales):
```
JIRA_API_TOKEN=tu-token
```

---

## Estructura de carpetas

```
src/
├── app/
│   ├── api/
│   │   ├── jira/route.ts        # Proxy Jira REST API
│   │   └── config/route.ts      # Test de conexión
│   ├── globals.css              # Estilos globales dark mode
│   ├── layout.tsx
│   ├── page.tsx                 # Página principal
│   └── providers.tsx            # React Query provider
├── components/
│   ├── alerts/
│   │   └── AlertBanner.tsx      # Banner de alertas internas
│   ├── charts/
│   │   └── AnalyticsPanel.tsx   # Gráficos analíticos
│   └── dashboard/
│       ├── CategoryCard.tsx     # Tarjeta por categoría
│       ├── ConfigPanel.tsx      # Panel de configuración
│       ├── Header.tsx           # Header + navegación
│       ├── SummaryBar.tsx       # Indicadores ejecutivos
│       └── TicketModal.tsx      # Modal de detalle con tabla
├── hooks/
│   └── useDashboard.ts          # Hook principal de datos
├── lib/
│   ├── jira.ts                  # Servicio Jira API
│   └── mockData.ts              # Datos de demostración
├── store/
│   └── configStore.ts           # Zustand store (persistido)
└── types/
    └── index.ts                 # TypeScript types
```

---

## Funcionalidades

- ✅ Dashboard ejecutivo con 5 categorías personalizables
- ✅ Semáforo 🔴🟡🟢 por tickets
- ✅ KPIs ejecutivos en la parte superior
- ✅ Estado de salud: Healthy / At Risk / Critical
- ✅ Modal de detalle con tabla filtrable y ordenable
- ✅ Alertas internas (sin popups invasivos)
- ✅ Sonido opcional al detectar nuevos tickets vencidos
- ✅ Auto-refresh cada 5 minutos
- ✅ Gráficos: evolución, cumplimiento, por categoría
- ✅ Configuración JQL por categoría
- ✅ Datos mock para demostración
- ✅ Dark mode nativo
- ✅ Responsive
- ✅ Configuración persistida en localStorage
