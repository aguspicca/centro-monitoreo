export type TicketStatus = "red" | "yellow" | "green";

export interface JiraConfig {
  url: string;
  email: string;
  token: string;
  slaDefaultDays: number;
}

export interface CategoryConfig {
  id: string;
  name: string;
  jql: string;
  enabled: boolean;
}

export interface AppConfig {
  jira: JiraConfig;
  categories: CategoryConfig[];
  soundEnabled: boolean;
  refreshInterval: number;
}

export interface JiraTicket {
  id: string;
  key: string;
  summary: string;
  status: string;
  assignee: string | null;
  dueDate: string | null;
  createdDate: string;
  priority: string;
  daysRemaining: number | null;
  ticketStatus: TicketStatus;
}

export interface CategoryData {
  id: string;
  name: string;
  tickets: JiraTicket[];
  red: number;
  yellow: number;
  green: number;
  total: number;
  compliance: number;
  loading: boolean;
  error: string | null;
}

export interface DashboardSummary {
  totalTickets: number;
  redTickets: number;
  yellowTickets: number;
  greenTickets: number;
  compliance: number;
  healthStatus: "healthy" | "at-risk" | "critical";
}

export interface AlertState {
  visible: boolean;
  newRedByCategory: Record<string, number>;
  totalNewRed: number;
}

export interface HistoricalPoint {
  date: string;
  red: number;
  yellow: number;
  green: number;
  total: number;
  compliance: number;
}

export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  {
    id: "prescreening",
    name: "Prescreening",
    jql: 'project = "PRES" AND status != Done ORDER BY created DESC',
    enabled: true,
  },
  {
    id: "escalamiento",
    name: "Escalamiento",
    jql: 'project = "ESC" AND status != Done ORDER BY created DESC',
    enabled: true,
  },
  {
    id: "mejoras-presupuesto",
    name: "Mejoras Presupuesto",
    jql: 'project = "MEJ" AND issuetype = "Mejora Presupuesto" AND status != Done ORDER BY created DESC',
    enabled: true,
  },
  {
    id: "mejoras-loan",
    name: "Mejoras Loan",
    jql: 'project = "MEJ" AND issuetype = "Mejora Loan" AND status != Done ORDER BY created DESC',
    enabled: true,
  },
  {
    id: "mejoras-collection",
    name: "Mejoras Collection",
    jql: 'project = "MEJ" AND issuetype = "Mejora Collection" AND status != Done ORDER BY created DESC',
    enabled: true,
  },
];

export const DEFAULT_CONFIG: AppConfig = {
  jira: { url: "", email: "", token: "", slaDefaultDays: 5 },
  categories: DEFAULT_CATEGORIES,
  soundEnabled: false,
  refreshInterval: 300000,
};
