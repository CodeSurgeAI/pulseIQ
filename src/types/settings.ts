export interface UserSettings {
  userId: string;
  dashboardModules: {
    users: boolean;
    hospitals: boolean;
    clinicalAI: boolean;
    workforceManagement: boolean;
    supplyChain: boolean;
    patientFlow: boolean;
    financialPerformance: boolean;
    leaderboard: boolean;
    alerts: boolean;
    kpiForm: boolean;
    recommendations: boolean;
  };
  widgetOrder: {
    [dashboardType: string]: string[]; // Array of widget IDs in display order
  };
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timezone: string;
}

export const defaultUserSettings: Omit<UserSettings, 'userId'> = {
  dashboardModules: {
    users: true,
    hospitals: true,
    clinicalAI: true,
    workforceManagement: true,
    supplyChain: true,
    patientFlow: true,
    financialPerformance: true,
    leaderboard: true,
    alerts: true,
    kpiForm: true,
    recommendations: true,
  },
  widgetOrder: {
    admin: [], // Will be populated with default order
    director: [],
    manager: [],
  },
  sidebarCollapsed: false,
  theme: 'light',
  notifications: {
    email: true,
    push: true,
    inApp: true,
  },
  dateFormat: 'MM/DD/YYYY',
  timezone: 'America/New_York',
};