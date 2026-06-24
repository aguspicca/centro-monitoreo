"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppConfig, DEFAULT_CONFIG, CategoryConfig, JiraConfig } from "@/types";

interface ConfigStore {
  config: AppConfig;
  isConfigured: boolean;
  useMockData: boolean;
  setJiraConfig: (jira: JiraConfig) => void;
  setCategories: (categories: CategoryConfig[]) => void;
  updateCategory: (id: string, updates: Partial<CategoryConfig>) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setUseMockData: (use: boolean) => void;
  resetConfig: () => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      config: DEFAULT_CONFIG,
      isConfigured: false,
      useMockData: true,

      setJiraConfig: (jira) =>
        set((s) => ({
          config: { ...s.config, jira },
          isConfigured: !!(jira.url && jira.email && jira.token),
        })),

      setCategories: (categories) =>
        set((s) => ({ config: { ...s.config, categories } })),

      updateCategory: (id, updates) =>
        set((s) => ({
          config: {
            ...s.config,
            categories: s.config.categories.map((c) =>
              c.id === id ? { ...c, ...updates } : c
            ),
          },
        })),

      setSoundEnabled: (soundEnabled) =>
        set((s) => ({ config: { ...s.config, soundEnabled } })),

      setUseMockData: (use) => set({ useMockData: use }),

      resetConfig: () =>
        set({ config: DEFAULT_CONFIG, isConfigured: false, useMockData: true }),
    }),
    { name: "centro-monitoreo-config" }
  )
);
