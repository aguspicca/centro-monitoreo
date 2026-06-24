import { NextResponse } from 'next/server';
export async function GET() {
  const categories = [];
  if (process.env.JIRA_JQL_PRESCREENING) categories.push({ id: 'prescreening', name: 'Prescreening', jql: process.env.JIRA_JQL_PRESCREENING, enabled: true });
  if (process.env.JIRA_JQL_ESCALAMIENTO) categories.push({ id: 'escalamiento', name: 'Escalamiento', jql: process.env.JIRA_JQL_ESCALAMIENTO, enabled: true });
  if (process.env.JIRA_JQL_MEJORAS) categories.push({ id: 'mejoras-presupuesto', name: 'Mejoras Presupuesto', jql: process.env.JIRA_JQL_MEJORAS, enabled: true });
  return NextResponse.json({ hasServerConfig: !!(process.env.JIRA_URL && process.env.JIRA_EMAIL && process.env.JIRA_API_TOKEN), jiraUrl: process.env.JIRA_URL || '', categories });
}