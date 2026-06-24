import { JiraConfig, JiraTicket, TicketStatus } from "@/types";
import { differenceInDays, parseISO } from "date-fns";

function classifyTicket(dueDate: string | null, createdDate: string, slaDefaultDays: number): { status: TicketStatus; daysRemaining: number | null } {
  let targetDate: Date;
  let daysRemaining: number | null = null;

  if (dueDate) {
    targetDate = parseISO(dueDate);
    daysRemaining = differenceInDays(targetDate, new Date());
  } else {
    const created = parseISO(createdDate);
    targetDate = new Date(created);
    targetDate.setDate(targetDate.getDate() + slaDefaultDays);
    daysRemaining = differenceInDays(targetDate, new Date());
  }

  let status: TicketStatus;
  if (daysRemaining < 0) status = "red";
  else if (daysRemaining <= 3) status = "yellow";
  else status = "green";

  return { status, daysRemaining };
}

export async function fetchJiraTickets(config: JiraConfig, jql: string): Promise<JiraTicket[]> {
  // Llamada a través del API Route del servidor para evitar CORS
  const response = await fetch("/api/jira", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: config.url,
      email: config.email,
      token: config.token,
      jql,
      slaDefaultDays: config.slaDefaultDays,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Error: ${response.status}`);
  }

  const data = await response.json();

  return data.issues.map((issue: any): JiraTicket => {
    const dueDate = issue.fields.duedate || null;
    const createdDate = issue.fields.created;
    const { status, daysRemaining } = classifyTicket(dueDate, createdDate, config.slaDefaultDays);

    return {
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status?.name || "Unknown",
      assignee: issue.fields.assignee?.displayName || null,
      dueDate,
      createdDate,
      priority: issue.fields.priority?.name || "Medium",
      daysRemaining,
      ticketStatus: status,
    };
  });
}

export async function testJiraConnection(config: JiraConfig): Promise<{ success: boolean; user?: string; error?: string }> {
  try {
    // También a través del servidor para evitar CORS
    const response = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: config.url, email: config.email, token: config.token }),
    });

    const data = await response.json();
    return data;
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
