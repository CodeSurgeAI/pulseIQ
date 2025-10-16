// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hospitalId?: string;
  departmentId?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export type UserRole = 'admin' | 'director' | 'manager';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Hospital and Department Types
export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  totalBeds: number;
  departments: Department[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  hospitalId: string;
  managerId?: string;
  description?: string;
  totalBeds?: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// KPI Types
export interface KPI {
  id: string;
  name: string;
  description: string;
  category: KPICategory;
  unit: string;
  targetValue?: number;
  isHigherBetter: boolean; // true if higher values are better, false if lower values are better
  formula?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export type KPICategory = 
  | 'patient_satisfaction'
  | 'clinical_quality' 
  | 'operational_efficiency'
  | 'financial_performance'
  | 'safety'
  | 'staff_performance';

export interface KPISubmission {
  id: string;
  kpiId: string;
  hospitalId: string;
  departmentId: string;
  submittedBy: string;
  value: number;
  month: number;
  year: number;
  notes?: string;
  status: SubmissionStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export type SubmissionStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

// Dashboard and Analytics Types
export interface DashboardMetric {
  kpiId: string;
  kpiName: string;
  currentValue: number;
  previousValue?: number;
  targetValue?: number;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
  unit: string;
  category: KPICategory;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  target?: number;
  label?: string;
}

export interface LeaderboardEntry {
  hospitalId: string;
  hospitalName: string;
  departmentId?: string;
  departmentName?: string;
  location?: string;
  score: number;
  rank: number;
  previousRank?: number;
  kpiValues: { [kpiId: string]: number };
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  type: AlertType;
  severity: AlertSeverity;
  kpiId?: string;
  hospitalId?: string;
  departmentId?: string;
  threshold?: number;
  currentValue?: number;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export type AlertType = 'performance' | 'target_missed' | 'anomaly' | 'trending_down' | 'system' | 'ai_prediction';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

// AI and ML Types
export interface AiPrediction {
  id: string;
  kpiId: string;
  kpiName: string;
  hospitalId: string;
  departmentId?: string;
  predictedValue: number;
  confidence: number; // 0-100
  predictionPeriod: 'next_month' | 'next_quarter' | 'next_year';
  currentTrend: 'improving' | 'declining' | 'stable';
  factors: string[]; // key factors influencing the prediction
  createdAt: Date;
  validUntil: Date;
}

export interface AiAnomaly {
  id: string;
  kpiId: string;
  kpiName: string;
  hospitalId: string;
  departmentId?: string;
  detectedValue: number;
  expectedRange: {
    min: number;
    max: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  description: string;
  possibleCauses: string[];
  detectedAt: Date;
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface AiRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'operational' | 'clinical' | 'financial' | 'strategic';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetKpis: string[]; // KPI IDs this recommendation affects
  hospitalId: string;
  departmentId?: string;
  estimatedImpact: {
    kpiId: string;
    currentValue: number;
    projectedValue: number;
    improvementPercentage: number;
  }[];
  implementationSteps: string[];
  estimatedTimeframe: string; // e.g., "2-4 weeks", "1-2 months"
  confidence: number; // 0-100
  createdAt: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  assignedTo?: string;
}

export interface FederatedLearningStatus {
  hospitalId: string;
  hospitalName: string;
  modelVersion: string;
  lastTrainingRun: Date;
  trainingStatus: 'idle' | 'training' | 'syncing' | 'error' | 'completed';
  contributedSamples: number;
  modelAccuracy?: number; // 0-100
  syncProgress?: number; // 0-100 when syncing
  nextScheduledTraining?: Date;
  errors?: string[];
  dataQualityScore?: number; // 0-100
}

export interface MlGatewayStatus {
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  version: string;
  lastHealthCheck: Date;
  responseTime: number; // in milliseconds
  activeModels: string[];
  queueSize: number;
  processedRequests24h: number;
  errorRate: number; // percentage
  systemResources: {
    cpuUsage: number; // percentage
    memoryUsage: number; // percentage
    diskUsage: number; // percentage
  };
}

// Enhanced Dashboard Types with AI
export interface AiDashboardSummary {
  predictions: AiPrediction[];
  anomalies: AiAnomaly[];
  recommendations: AiRecommendation[];
  federatedStatus?: FederatedLearningStatus;
  mlGatewayStatus: MlGatewayStatus;
  trendsInsight: {
    improvingKpis: string[];
    decliningKpis: string[];
    stableKpis: string[];
    riskFactors: string[];
  };
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  hospitalName: string;
  adminName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface KPIFormData {
  kpiId: string;
  value: number;
  notes?: string;
  month: number;
  year: number;
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  hospitalId?: string;
  departmentId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation Types
export interface NavItem {
  id: string;
  title: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  roles?: UserRole[];
  settingsModule?: 'users' | 'hospitals' | 'clinicalAI' | 'workforceManagement' | 'supplyChain' | 'patientFlow' | 'financialPerformance' | 'leaderboard' | 'alerts' | 'kpiForm' | 'recommendations' | null;
  configKey?: string; // Key to check in config.json ui.screens
}

// Chart Configuration Types
export interface ChartConfig {
  type: 'line' | 'bar' | 'area' | 'pie' | 'heatmap';
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  colors?: string[];
}