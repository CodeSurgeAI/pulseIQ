import configData from '../../config.json';

export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: string;
  };
  authentication: {
    enableLogin: boolean;
    defaultUser: {
      id: string;
      name: string;
      email: string;
      role: string;
      hospitalId: string;
      isActive: boolean;
    };
    sessionTimeout: number;
    requireEmailVerification: boolean;
  };
  features: {
    aiIntegration: boolean;
    federatedLearning: boolean;
    realTimeUpdates: boolean;
    offlineMode: boolean;
  };
  ui: {
    theme: string;
    enableDarkMode: boolean;
    defaultLanguage: string;
    showWelcomeTour: boolean;
    screens: {
      admin: {
        dashboard: boolean;
        users: boolean;
        hospitals: boolean;
        userRegistrationDetails: boolean;
        clinicalDecisionSupport: boolean;
        workforceManagement: boolean;
        supplyChainIntelligence: boolean;
        patientFlowManagement: boolean;
        financialPerformance: boolean;
      };
      director: {
        dashboard: boolean;
        alerts: boolean;
        leaderboard: boolean;
        clinicalDecisionSupport: boolean;
        workforceManagement: boolean;
        supplyChainIntelligence: boolean;
        patientFlowManagement: boolean;
        financialPerformance: boolean;
      };
      manager: {
        dashboard: boolean;
        kpiForm: boolean;
        recommendations: boolean;
        clinicalDecisionSupport: boolean;
        workforceManagement: boolean;
        supplyChainIntelligence: boolean;
        patientFlowManagement: boolean;
        financialPerformance: boolean;
      };
    };
  };
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  monitoring: {
    enableAnalytics: boolean;
    enableErrorReporting: boolean;
    enablePerformanceTracking: boolean;
  };
}

// Default configuration
const defaultConfig: AppConfig = {
  app: {
    name: "PulseIQ",
    version: "1.0.0",
    environment: "development"
  },
  authentication: {
    enableLogin: false,
    defaultUser: {
      id: "1",
      name: "System Administrator",
      email: "admin@hospital-kpi.com",
      role: "admin",
      hospitalId: "1",
      isActive: true
    },
    sessionTimeout: 86400000,
    requireEmailVerification: false
  },
  features: {
    aiIntegration: true,
    federatedLearning: true,
    realTimeUpdates: false,
    offlineMode: false
  },
  ui: {
    theme: "default",
    enableDarkMode: false,
    defaultLanguage: "en",
    showWelcomeTour: true,
    screens: {
      admin: {
        dashboard: true,
        users: true,
        hospitals: true,
        userRegistrationDetails: true,
        clinicalDecisionSupport: true,
        workforceManagement: true,
        supplyChainIntelligence: true,
        patientFlowManagement: true,
        financialPerformance: true
      },
      director: {
        dashboard: true,
        alerts: true,
        leaderboard: true,
        clinicalDecisionSupport: true,
        workforceManagement: true,
        supplyChainIntelligence: true,
        patientFlowManagement: true,
        financialPerformance: true
      },
      manager: {
        dashboard: true,
        kpiForm: true,
        recommendations: true,
        clinicalDecisionSupport: true,
        workforceManagement: true,
        supplyChainIntelligence: true,
        patientFlowManagement: true,
        financialPerformance: true
      }
    }
  },
  api: {
    baseUrl: "http://localhost:8080/api",
    timeout: 30000,
    retryAttempts: 3
  },
  monitoring: {
    enableAnalytics: false,
    enableErrorReporting: false,
    enablePerformanceTracking: false
  }
};

class ConfigService {
  private config: AppConfig;

  constructor() {
    // Merge imported config with defaults
    this.config = { ...defaultConfig, ...configData };
  }

  // Authentication configuration
  get isLoginEnabled(): boolean {
    return this.config.authentication.enableLogin;
  }

  get defaultUser() {
    return this.config.authentication.defaultUser;
  }

  get sessionTimeout(): number {
    return this.config.authentication.sessionTimeout;
  }

  // Feature flags
  get isAiIntegrationEnabled(): boolean {
    return this.config.features.aiIntegration;
  }

  get isFederatedLearningEnabled(): boolean {
    return this.config.features.federatedLearning;
  }

  get isRealTimeUpdatesEnabled(): boolean {
    return this.config.features.realTimeUpdates;
  }

  // UI configuration
  get theme(): string {
    return this.config.ui.theme;
  }

  get isDarkModeEnabled(): boolean {
    return this.config.ui.enableDarkMode;
  }

  get shouldShowWelcomeTour(): boolean {
    return this.config.ui.showWelcomeTour;
  }

  // API configuration
  get apiBaseUrl(): string {
    return this.config.api.baseUrl;
  }

  get apiTimeout(): number {
    return this.config.api.timeout;
  }

  // App information
  get appName(): string {
    return this.config.app.name;
  }

  get appVersion(): string {
    return this.config.app.version;
  }

  get environment(): string {
    return this.config.app.environment;
  }

  // Monitoring configuration
  get isAnalyticsEnabled(): boolean {
    return this.config.monitoring.enableAnalytics;
  }

  get isErrorReportingEnabled(): boolean {
    return this.config.monitoring.enableErrorReporting;
  }

  // Screen configuration methods
  isScreenEnabled(role: 'admin' | 'director' | 'manager', screen: string): boolean {
    const roleScreens = this.config.ui.screens[role];
    return (roleScreens as Record<string, boolean>)[screen] ?? true; // Default to true if not found
  }

  // Admin screen checks
  get isAdminDashboardEnabled(): boolean {
    return this.config.ui.screens.admin.dashboard;
  }

  get isAdminUsersEnabled(): boolean {
    return this.config.ui.screens.admin.users;
  }

  get isAdminHospitalsEnabled(): boolean {
    return this.config.ui.screens.admin.hospitals;
  }

  get isAdminUserRegistrationEnabled(): boolean {
    return this.config.ui.screens.admin.userRegistrationDetails;
  }

  // Director screen checks
  get isDirectorDashboardEnabled(): boolean {
    return this.config.ui.screens.director.dashboard;
  }

  get isDirectorAlertsEnabled(): boolean {
    return this.config.ui.screens.director.alerts;
  }

  get isDirectorLeaderboardEnabled(): boolean {
    return this.config.ui.screens.director.leaderboard;
  }

  // Manager screen checks
  get isManagerDashboardEnabled(): boolean {
    return this.config.ui.screens.manager.dashboard;
  }

  get isManagerKpiFormEnabled(): boolean {
    return this.config.ui.screens.manager.kpiForm;
  }

  get isManagerRecommendationsEnabled(): boolean {
    return this.config.ui.screens.manager.recommendations;
  }

  // Module screen checks (works across all roles)
  isClinicalDecisionSupportEnabled(role: 'admin' | 'director' | 'manager'): boolean {
    return this.config.ui.screens[role].clinicalDecisionSupport;
  }

  isWorkforceManagementEnabled(role: 'admin' | 'director' | 'manager'): boolean {
    return this.config.ui.screens[role].workforceManagement;
  }

  isSupplyChainIntelligenceEnabled(role: 'admin' | 'director' | 'manager'): boolean {
    return this.config.ui.screens[role].supplyChainIntelligence;
  }

  isPatientFlowManagementEnabled(role: 'admin' | 'director' | 'manager'): boolean {
    return this.config.ui.screens[role].patientFlowManagement;
  }

  isFinancialPerformanceEnabled(role: 'admin' | 'director' | 'manager'): boolean {
    return this.config.ui.screens[role].financialPerformance;
  }

  // Get full configuration
  getConfig(): AppConfig {
    return this.config;
  }

  // Update configuration (for runtime changes)
  updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

export const configService = new ConfigService();
export default configService;