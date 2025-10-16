'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSettings, defaultUserSettings } from '@/types/settings';

interface SettingsStore {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeSettings: (userId: string) => void;
  updateSettings: (updates: Partial<Omit<UserSettings, 'userId'>>) => void;
  toggleModule: (module: keyof UserSettings['dashboardModules']) => void;
  updateWidgetOrder: (dashboardType: string, widgetOrder: string[]) => void;
  getWidgetOrder: (dashboardType: string) => string[];
  resetWidgetOrder: (dashboardType: string) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: null,
      isLoading: false,
      error: null,

      initializeSettings: (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const existingSettings = get().settings;
          
          if (!existingSettings || existingSettings.userId !== userId) {
            const newSettings: UserSettings = {
              userId,
              ...defaultUserSettings,
            };
            set({ settings: newSettings, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to initialize settings',
            isLoading: false 
          });
        }
      },

      updateSettings: (updates: Partial<Omit<UserSettings, 'userId'>>) => {
        const currentSettings = get().settings;
        if (!currentSettings) return;

        const updatedSettings: UserSettings = {
          ...currentSettings,
          ...updates,
        };

        set({ settings: updatedSettings });
      },

      toggleModule: (module: keyof UserSettings['dashboardModules']) => {
        const currentSettings = get().settings;
        if (!currentSettings) return;

        const updatedSettings: UserSettings = {
          ...currentSettings,
          dashboardModules: {
            ...currentSettings.dashboardModules,
            [module]: !currentSettings.dashboardModules[module],
          },
        };

        set({ settings: updatedSettings });
      },

      updateWidgetOrder: (dashboardType: string, widgetOrder: string[]) => {
        const currentSettings = get().settings;
        if (!currentSettings) return;

        const updatedSettings: UserSettings = {
          ...currentSettings,
          widgetOrder: {
            ...currentSettings.widgetOrder,
            [dashboardType]: widgetOrder,
          },
        };

        set({ settings: updatedSettings });
      },

      getWidgetOrder: (dashboardType: string) => {
        const currentSettings = get().settings;
        if (!currentSettings) return [];
        
        return currentSettings.widgetOrder[dashboardType] || [];
      },

      resetWidgetOrder: (dashboardType: string) => {
        const currentSettings = get().settings;
        if (!currentSettings) return;

        const updatedSettings: UserSettings = {
          ...currentSettings,
          widgetOrder: {
            ...currentSettings.widgetOrder,
            [dashboardType]: [],
          },
        };

        set({ settings: updatedSettings });
      },

      resetSettings: () => {
        const currentSettings = get().settings;
        if (!currentSettings) return;

        const resetSettings: UserSettings = {
          userId: currentSettings.userId,
          ...defaultUserSettings,
        };

        set({ settings: resetSettings });
      },

      exportSettings: () => {
        const currentSettings = get().settings;
        if (!currentSettings) return '';
        
        return JSON.stringify(currentSettings, null, 2);
      },

      importSettings: (settingsJson: string) => {
        try {
          const importedSettings = JSON.parse(settingsJson) as UserSettings;
          
          // Validate the imported settings structure
          if (!importedSettings.userId || !importedSettings.dashboardModules) {
            throw new Error('Invalid settings format');
          }

          set({ settings: importedSettings });
          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to import settings' 
          });
          return false;
        }
      },
    }),
    {
      name: 'user-settings-storage',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);