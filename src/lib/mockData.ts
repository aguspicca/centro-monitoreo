import { JiraTicket, CategoryData } from "@/types";

function randomDate(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
}

const assignees = ["Ana López", "Carlos Méndez", "Laura García", "Pedro Ruiz", "Sofía Torres", null];
const priorities = ["Highest", "High", "Medium", "Low"];
const statuses = ["In Progress", "To Do", "In Review", "Blocked"];

function makeTicket(key: string, daysRemaining: number): JiraTicket {
  const status = daysRemaining < 0 ? "red" : daysRemaining <= 3 ? "yellow" : "green";
  return {
    id: Math.random().toString(36).slice(2),
    key,
    summary: `[Mock] Ticket de prueba ${key} - ${status === "red" ? "Vencido" : status === "yellow" ? "Próximo a vencer" : "En tiempo"}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    assignee: assignees[Math.floor(Math.random() * assignees.length)],
    dueDate: randomDate(daysRemaining),
    createdDate: randomDate(daysRemaining - 5),
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    daysRemaining,
    ticketStatus: status as any,
  };
}

export const MOCK_CATEGORIES: CategoryData[] = [
  {
    id: "prescreening",
    name: "Prescreening",
    tickets: [
      ...Array.from({ length: 12 }, (_, i) => makeTicket(`PRES-${100 + i}`, -Math.floor(Math.random() * 10) - 1)),
      ...Array.from({ length: 5 }, (_, i) => makeTicket(`PRES-${200 + i}`, Math.floor(Math.random() * 3))),
      ...Array.from({ length: 18 }, (_, i) => makeTicket(`PRES-${300 + i}`, Math.floor(Math.random() * 20) + 4)),
    ],
    red: 12, yellow: 5, green: 18, total: 35,
    compliance: Math.round((23 / 35) * 100),
    loading: false, error: null,
  },
  {
    id: "escalamiento",
    name: "Escalamiento",
    tickets: [
      ...Array.from({ length: 3 }, (_, i) => makeTicket(`ESC-${100 + i}`, -Math.floor(Math.random() * 5) - 1)),
      ...Array.from({ length: 8 }, (_, i) => makeTicket(`ESC-${200 + i}`, Math.floor(Math.random() * 3))),
      ...Array.from({ length: 24 }, (_, i) => makeTicket(`ESC-${300 + i}`, Math.floor(Math.random() * 20) + 4)),
    ],
    red: 3, yellow: 8, green: 24, total: 35,
    compliance: Math.round((32 / 35) * 100),
    loading: false, error: null,
  },
  {
    id: "mejoras-presupuesto",
    name: "Mejoras Presupuesto",
    tickets: [
      ...Array.from({ length: 7 }, (_, i) => makeTicket(`MEJ-P${100 + i}`, -Math.floor(Math.random() * 8) - 1)),
      ...Array.from({ length: 4 }, (_, i) => makeTicket(`MEJ-P${200 + i}`, Math.floor(Math.random() * 3))),
      ...Array.from({ length: 9 }, (_, i) => makeTicket(`MEJ-P${300 + i}`, Math.floor(Math.random() * 20) + 4)),
    ],
    red: 7, yellow: 4, green: 9, total: 20,
    compliance: Math.round((13 / 20) * 100),
    loading: false, error: null,
  },
  {
    id: "mejoras-loan",
    name: "Mejoras Loan",
    tickets: [
      ...Array.from({ length: 2 }, (_, i) => makeTicket(`MEJ-L${100 + i}`, -Math.floor(Math.random() * 3) - 1)),
      ...Array.from({ length: 3 }, (_, i) => makeTicket(`MEJ-L${200 + i}`, Math.floor(Math.random() * 3))),
      ...Array.from({ length: 15 }, (_, i) => makeTicket(`MEJ-L${300 + i}`, Math.floor(Math.random() * 20) + 4)),
    ],
    red: 2, yellow: 3, green: 15, total: 20,
    compliance: Math.round((18 / 20) * 100),
    loading: false, error: null,
  },
  {
    id: "mejoras-collection",
    name: "Mejoras Collection",
    tickets: [
      ...Array.from({ length: 5 }, (_, i) => makeTicket(`MEJ-C${100 + i}`, -Math.floor(Math.random() * 6) - 1)),
      ...Array.from({ length: 6 }, (_, i) => makeTicket(`MEJ-C${200 + i}`, Math.floor(Math.random() * 3))),
      ...Array.from({ length: 14 }, (_, i) => makeTicket(`MEJ-C${300 + i}`, Math.floor(Math.random() * 20) + 4)),
    ],
    red: 5, yellow: 6, green: 14, total: 25,
    compliance: Math.round((20 / 25) * 100),
    loading: false, error: null,
  },
];

export function generateMockHistory(days = 14) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const red = Math.floor(Math.random() * 20) + 5;
    const yellow = Math.floor(Math.random() * 15) + 3;
    const green = Math.floor(Math.random() * 60) + 40;
    const total = red + yellow + green;
    return {
      date: d.toISOString().split("T")[0],
      red, yellow, green, total,
      compliance: Math.round(((yellow + green) / total) * 100),
    };
  });
}
