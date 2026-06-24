'use client';
import { useQuery } from '@tanstack/react-query';
import { useConfigStore } from '@/store/configStore';
import { CategoryData, DashboardSummary, AlertState } from '@/types';
import { fetchJiraTickets } from '@/lib/jira';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { useRef, useState, useEffect } from 'react';

async function fetchServerConfig() {
  try { const res = await fetch('/api/server-config'); return await res.json(); } catch { return { hasServerConfig: false, categories: [], jiraUrl: '' }; }
}

async function fetchAllCategories(config: any, clientCategories: any[], useMock: boolean, serverConfig: any): Promise<CategoryData[]> {
  if (useMock) { await new Promise(r => setTimeout(r, 800)); return MOCK_CATEGORIES; }
  const categories = serverConfig?.categories?.length > 0 ? serverConfig.categories : clientCategories.filter((c: any) => c.enabled);
  return Promise.all(categories.map(async (cat: any): Promise<CategoryData> => {
    try {
      const tickets = await fetchJiraTickets(config.jira, cat.jql);
      const red = tickets.filter((t: any) => t.ticketStatus === 'red').length;
      const yellow = tickets.filter((t: any) => t.ticketStatus === 'yellow').length;
      const green = tickets.filter((t: any) => t.ticketStatus === 'green').length;
      const total = tickets.length;
      const compliance = total > 0 ? Math.round(((yellow + green) / total) * 100) : 100;
      return { id: cat.id, name: cat.name, tickets, red, yellow, green, total, compliance, loading: false, error: null };
    } catch (e: any) {
      return { id: cat.id, name: cat.name, tickets: [], red: 0, yellow: 0, green: 0, total: 0, compliance: 0, loading: false, error: e.message };
    }
  }));
}

export function useDashboard() {
  const { config, useMockData } = useConfigStore();
  const prevRedRef = useRef<Record<string, number>>({});
  const [alert, setAlert] = useState<AlertState>({ visible: false, newRedByCategory: {}, totalNewRed: 0 });
  const serverConfigQuery = useQuery({ queryKey: ['server-config'], queryFn: fetchServerConfig, staleTime: Infinity });
  const query = useQuery({ queryKey: ['dashboard', config, useMockData, serverConfigQuery.data], queryFn: () => fetchAllCategories(config, config.categories, useMockData, serverConfigQuery.data), refetchInterval: config.refreshInterval, staleTime: 0, enabled: !serverConfigQuery.isLoading });
  useEffect(() => {
    if (!query.data) return;
    const newRedByCategory: Record<string, number> = {};
    let totalNewRed = 0;
    for (const cat of query.data) { const prev = prevRedRef.current[cat.id] ?? 0; const diff = cat.red - prev; if (diff > 0) { newRedByCategory[cat.name] = diff; totalNewRed += diff; } }
    prevRedRef.current = Object.fromEntries(query.data.map(c => [c.id, c.red]));
    if (totalNewRed > 0) setAlert({ visible: true, newRedByCategory, totalNewRed });
  }, [query.data]);
  const summary: DashboardSummary = query.data ? (() => { const total = query.data.reduce((s, c) => s + c.total, 0); const red = query.data.reduce((s, c) => s + c.red, 0); const yellow = query.data.reduce((s, c) => s + c.yellow, 0); const green = query.data.reduce((s, c) => s + c.green, 0); const compliance = total > 0 ? Math.round(((yellow + green) / total) * 100) : 100; const healthStatus = compliance >= 90 ? 'healthy' : compliance >= 70 ? 'at-risk' : 'critical'; return { totalTickets: total, redTickets: red, yellowTickets: yellow, greenTickets: green, compliance, healthStatus }; })() : { totalTickets: 0, redTickets: 0, yellowTickets: 0, greenTickets: 0, compliance: 0, healthStatus: 'critical' as const };
  return { categories: query.data ?? [], summary, loading: query.isLoading || serverConfigQuery.isLoading, error: query.error as Error | null, refetch: () => { query.remove(); return query.refetch(); }, lastUpdated: query.dataUpdatedAt, alert, dismissAlert: () => setAlert({ visible: false, newRedByCategory: {}, totalNewRed: 0 }), hasServerConfig: serverConfigQuery.data?.hasServerConfig ?? false, jiraUrl: (serverConfigQuery.data?.jiraUrl as string) || '' };
}


