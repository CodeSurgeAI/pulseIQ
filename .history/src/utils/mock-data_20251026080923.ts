import { 
  User, 
  Hospital, 
  Department, 
  KPI, 
  KPISubmission, 
  DashboardMetric, 
  LeaderboardEntry, 
  Alert,
  ChartDataPoint,
  AiPrediction,
  AiAnomaly,
  AiRecommendation,
  FederatedLearningStatus,
  MlGatewayStatus
} from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hospital.com',
    name: 'System Administrator',
    role: 'admin',
    avatar: undefined,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '2',
    email: 'director@generalhospital.com',
    name: 'Dr. Sarah Johnson',
    role: 'director',
    hospitalId: '1',
    avatar: undefined,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '3',
    email: 'manager@generalhospital.com',
    name: 'Mark Thompson',
    role: 'manager',
    hospitalId: '1',
    departmentId: '1',
    avatar: undefined,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    isActive: true,
  },
];

// Mock Hospitals
export const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'General Hospital',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '(555) 123-4567',
    email: 'info@generalhospital.com',
    website: 'https://generalhospital.com',
    totalBeds: 500,
    departments: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '2',
    name: 'City Medical Center',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    phone: '(555) 987-6543',
    email: 'info@citymedical.com',
    website: 'https://citymedical.com',
    totalBeds: 750,
    departments: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    isActive: true,
  },
];

// Mock Departments
export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Emergency Department',
    hospitalId: '1',
    managerId: '3',
    description: 'Emergency medical services',
    totalBeds: 50,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '2',
    name: 'Cardiology',
    hospitalId: '1',
    description: 'Heart and cardiovascular care',
    totalBeds: 30,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '3',
    name: 'Pediatrics',
    hospitalId: '1',
    description: 'Children\'s healthcare',
    totalBeds: 40,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
];

// Mock KPIs
export const mockKPIs: KPI[] = [
  {
    id: '1',
    name: 'Average Wait Time',
    description: 'Average time patients wait before being seen',
    category: 'operational_efficiency',
    unit: 'minutes',
    targetValue: 30,
    isHigherBetter: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '2',
    name: 'Patient Satisfaction Score',
    description: 'Overall patient satisfaction rating',
    category: 'patient_satisfaction',
    unit: 'score (1-10)',
    targetValue: 8.5,
    isHigherBetter: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '3',
    name: 'Readmission Rate',
    description: '30-day readmission rate',
    category: 'clinical_quality',
    unit: '%',
    targetValue: 10,
    isHigherBetter: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '4',
    name: 'Bed Occupancy Rate',
    description: 'Percentage of beds occupied',
    category: 'operational_efficiency',
    unit: '%',
    targetValue: 85,
    isHigherBetter: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  // Clinical Quality KPIs
  {
    id: '5',
    name: 'Mortality Rate',
    description: 'Deaths per 1,000 admissions',
    category: 'clinical_quality',
    unit: 'per 1,000',
    targetValue: 5,
    isHigherBetter: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '6',
    name: 'Infection Rate (HAI)',
    description: 'Hospital-acquired infection frequency',
    category: 'clinical_quality',
    unit: '%',
    targetValue: 2,
    isHigherBetter: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '7',
    name: 'Medication Error Rate',
    description: 'Medication errors per 1,000 doses',
    category: 'clinical_quality',
    unit: 'per 1,000',
    targetValue: 1,
    isHigherBetter: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '8',
    name: 'Surgery Success Rate',
    description: 'Percentage of surgeries without complications',
    category: 'clinical_quality',
    unit: '%',
    targetValue: 95,
    isHigherBetter: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },

  // Operational Efficiency KPIs
  {
    id: '9',
    name: 'Average Length of Stay (ALOS)',
    description: 'Average number of days patients stay in hospital',
    category: 'operational_efficiency',
    unit: 'days',
    targetValue: 4.5,
    isHigherBetter: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '10',
    name: 'ER Wait Time',
    description: 'Average waiting time for emergency room patients',
    category: 'operational_efficiency',
    unit: 'minutes',
    targetValue: 30,
    isHigherBetter: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '11',
    name: 'Theater Utilization Rate',
    description: 'Efficiency of operation theater usage',
    category: 'operational_efficiency',
    unit: '%',
    targetValue: 85,
    isHigherBetter: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '12',
    name: 'Staff-to-Patient Ratio',
    description: 'Available clinical staff per patient',
    category: 'operational_efficiency',
    unit: 'ratio',
    targetValue: 0.2, // ~1:5
    isHigherBetter: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },

  // Financial KPIs
  {
    id: '13',
    name: 'Cost per Patient',
    description: 'Total hospital cost divided by number of treated patients',
    category: 'financial_performance',
    unit: '$',
    targetValue: 2500,
    isHigherBetter: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '14',
    name: 'Revenue per Bed',
    description: 'Income generated per available bed',
    category: 'financial_performance',
    unit: '$',
    targetValue: 15000,
    isHigherBetter: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '15',
    name: 'Bad Debt Ratio',
    description: 'Unpaid bills as a percentage of total revenue',
    category: 'financial_performance',
    unit: '%',
    targetValue: 2,
    isHigherBetter: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '16',
    name: 'Collection Rate',
    description: 'Percentage of billed amounts successfully collected',
    category: 'financial_performance',
    unit: '%',
    targetValue: 98,
    isHigherBetter: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '17',
    name: 'Operating Margin',
    description: 'Profitability after operating expenses',
    category: 'financial_performance',
    unit: '%',
    targetValue: 8,
    isHigherBetter: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },

  // Patient Experience KPIs
  {
    id: '18',
    name: 'Net Promoter Score (NPS)',
    description: 'Likelihood of patients recommending the hospital',
    category: 'patient_satisfaction',
    unit: 'NPS',
    targetValue: 50,
    isHigherBetter: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '19',
    name: 'Complaint Resolution Time',
    description: 'Average time taken to resolve patient complaints',
    category: 'patient_satisfaction',
    unit: 'hours',
    targetValue: 48,
    isHigherBetter: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '20',
    name: 'Appointment No-Show Rate',
    description: 'Percentage of patients missing scheduled appointments',
    category: 'patient_satisfaction',
    unit: '%',
    targetValue: 5,
    isHigherBetter: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },

  // Staff and HR KPIs
  {
    id: '21',
    name: 'Staff Turnover Rate',
    description: 'Percentage of employees leaving per year',
    category: 'staff_performance',
    unit: '%',
    targetValue: 10,
    isHigherBetter: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '22',
    name: 'Training Hours per Employee',
    description: 'Average annual training hours per employee',
    category: 'staff_performance',
    unit: 'hours',
    targetValue: 24,
    isHigherBetter: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '23',
    name: 'Absenteeism Rate',
    description: 'Frequency of staff absence',
    category: 'staff_performance',
    unit: '%',
    targetValue: 3,
    isHigherBetter: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '24',
    name: 'Employee Satisfaction Index',
    description: 'Employee morale and motivation score',
    category: 'staff_performance',
    unit: 'score (1-10)',
    targetValue: 8,
    isHigherBetter: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true,
  },
];

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetric[] = [
  {
    kpiId: '1',
    kpiName: 'Average Wait Time',
    currentValue: 25,
    previousValue: 32,
    targetValue: 30,
    trend: 'down',
    changePercentage: -21.9,
    unit: 'minutes',
    category: 'operational_efficiency',
  },
  {
    kpiId: '2',
    kpiName: 'Patient Satisfaction',
    currentValue: 8.7,
    previousValue: 8.2,
    targetValue: 8.5,
    trend: 'up',
    changePercentage: 6.1,
    unit: 'score',
    category: 'patient_satisfaction',
  },
  {
    kpiId: '3',
    kpiName: 'Readmission Rate',
    currentValue: 8.5,
    previousValue: 11.2,
    targetValue: 10,
    trend: 'down',
    changePercentage: -24.1,
    unit: '%',
    category: 'clinical_quality',
  },
  {
    kpiId: '4',
    kpiName: 'Bed Occupancy',
    currentValue: 87,
    previousValue: 85,
    targetValue: 85,
    trend: 'up',
    changePercentage: 2.4,
    unit: '%',
    category: 'operational_efficiency',
  },
];

// Mock Chart Data
export const mockChartData: ChartDataPoint[] = [
  { date: '2024-01', value: 35, target: 30 },
  { date: '2024-02', value: 32, target: 30 },
  { date: '2024-03', value: 28, target: 30 },
  { date: '2024-04', value: 30, target: 30 },
  { date: '2024-05', value: 27, target: 30 },
  { date: '2024-06', value: 25, target: 30 },
];

// Mock Leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    hospitalId: '1',
    hospitalName: 'General Hospital',
    score: 92.5,
    rank: 1,
    previousRank: 2,
    kpiValues: { '1': 25, '2': 8.7, '3': 8.5, '4': 87 },
  },
  {
    hospitalId: '2',
    hospitalName: 'City Medical Center',
    score: 89.2,
    rank: 2,
    previousRank: 1,
    kpiValues: { '1': 28, '2': 8.4, '3': 9.2, '4': 85 },
  },
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Wait Time Exceeding Target',
    description: 'Emergency Department wait times are 15% above target',
    type: 'target_missed',
    severity: 'medium',
    kpiId: '1',
    hospitalId: '1',
    departmentId: '1',
    threshold: 30,
    currentValue: 34.5,
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    title: 'Excellent Patient Satisfaction',
    description: 'Patient satisfaction scores have improved significantly',
    type: 'performance',
    severity: 'low',
    kpiId: '2',
    hospitalId: '1',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '3',
    title: 'Critical: High Readmission Rate Detected',
    description: 'Readmission rate in Cardiology department is critically high',
    type: 'anomaly',
    severity: 'critical',
    kpiId: '3',
    hospitalId: '1',
    departmentId: '2',
    threshold: 10,
    currentValue: 15.2,
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
];

// Mock KPI Submissions
export const mockKPISubmissions: KPISubmission[] = [
  {
    id: '1',
    kpiId: '1',
    hospitalId: '1',
    departmentId: '1',
    submittedBy: '3',
    value: 25,
    month: 6,
    year: 2024,
    notes: 'Improved triage process implemented',
    status: 'approved',
    submittedAt: new Date('2024-06-01'),
    reviewedAt: new Date('2024-06-02'),
    reviewedBy: '2',
  },
  {
    id: '2',
    kpiId: '2',
    hospitalId: '1',
    departmentId: '1',
    submittedBy: '3',
    value: 8.7,
    month: 6,
    year: 2024,
    notes: 'New patient feedback system showing positive results',
    status: 'approved',
    submittedAt: new Date('2024-06-01'),
    reviewedAt: new Date('2024-06-02'),
    reviewedBy: '2',
  },
];

// Mock AI Predictions
export const mockAiPredictions: AiPrediction[] = [
  {
    id: 'pred-1',
    kpiId: '1',
    kpiName: 'Average Wait Time',
    hospitalId: '1',
    departmentId: '1',
    predictedValue: 22,
    confidence: 87,
    predictionPeriod: 'next_month',
    currentTrend: 'improving',
    factors: ['Staffing optimization', 'New triage system', 'Seasonal patterns'],
    createdAt: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  {
    id: 'pred-2',
    kpiId: '2',
    kpiName: 'Patient Satisfaction Score',
    hospitalId: '1',
    predictedValue: 8.9,
    confidence: 92,
    predictionPeriod: 'next_quarter',
    currentTrend: 'improving',
    factors: ['Staff training program', 'Facility improvements', 'Communication initiatives'],
    createdAt: new Date(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
  },
];

// Mock AI Anomalies
export const mockAiAnomalies: AiAnomaly[] = [
  {
    id: 'anom-1',
    kpiId: '3',
    kpiName: 'Readmission Rate',
    hospitalId: '1',
    departmentId: '2',
    detectedValue: 15.8,
    expectedRange: { min: 7, max: 12 },
    severity: 'high',
    confidence: 94,
    description: 'Readmission rate significantly above expected range for cardiology department',
    possibleCauses: ['Discharge protocol gaps', 'Follow-up care issues', 'Patient education deficiency'],
    detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isResolved: false,
  },
  {
    id: 'anom-2',
    kpiId: '1',
    kpiName: 'Average Wait Time',
    hospitalId: '2',
    detectedValue: 65,
    expectedRange: { min: 20, max: 45 },
    severity: 'critical',
    confidence: 96,
    description: 'Emergency department wait times unusually high during typical low-traffic hours',
    possibleCauses: ['Staff shortage', 'System downtime', 'Unexpected patient surge'],
    detectedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isResolved: false,
  },
  {
    id: 'anom-3',
    kpiId: '2',
    kpiName: 'Patient Satisfaction Score',
    hospitalId: '1',
    detectedValue: 9.2,
    expectedRange: { min: 8, max: 8.8 },
    severity: 'low',
    confidence: 78,
    description: 'Patient satisfaction unexpectedly high - worth investigating positive factors',
    possibleCauses: ['New staff member excellence', 'Process improvement success', 'Facility upgrade impact'],
    detectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    isResolved: true,
    resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    resolvedBy: 'Dr. Sarah Johnson',
  },
];

// Mock AI Recommendations
export const mockAiRecommendations: AiRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Implement Fast-Track Triage System',
    description: 'Deploy an AI-assisted triage system to reduce wait times and improve patient flow efficiency in the emergency department.',
    category: 'operational',
    priority: 'high',
    targetKpis: ['1'],
    hospitalId: '1',
    departmentId: '1',
    estimatedImpact: [
      {
        kpiId: '1',
        currentValue: 25,
        projectedValue: 18,
        improvementPercentage: 28,
      },
    ],
    implementationSteps: [
      'Conduct triage process analysis',
      'Select and configure AI triage software',
      'Train medical staff on new system',
      'Pilot program in one department',
      'Full deployment and monitoring',
    ],
    estimatedTimeframe: '6-8 weeks',
    confidence: 89,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
  {
    id: 'rec-2',
    title: 'Enhance Post-Discharge Follow-up Protocol',
    description: 'Implement automated follow-up system with AI-powered risk assessment to reduce readmission rates.',
    category: 'clinical',
    priority: 'urgent',
    targetKpis: ['3'],
    hospitalId: '1',
    departmentId: '2',
    estimatedImpact: [
      {
        kpiId: '3',
        currentValue: 8.5,
        projectedValue: 6.2,
        improvementPercentage: 27,
      },
    ],
    implementationSteps: [
      'Analyze current discharge patterns',
      'Develop risk stratification model',
      'Create automated follow-up workflows',
      'Integrate with patient communication systems',
      'Train clinical staff on new protocols',
    ],
    estimatedTimeframe: '4-6 weeks',
    confidence: 92,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'in_progress',
    assignedTo: 'Dr. Michael Chen',
  },
  {
    id: 'rec-3',
    title: 'Optimize Bed Allocation Algorithm',
    description: 'Deploy machine learning model to predict bed demand and optimize allocation across departments.',
    category: 'operational',
    priority: 'medium',
    targetKpis: ['4'],
    hospitalId: '1',
    estimatedImpact: [
      {
        kpiId: '4',
        currentValue: 87,
        projectedValue: 92,
        improvementPercentage: 5.7,
      },
    ],
    implementationSteps: [
      'Collect historical bed utilization data',
      'Train predictive allocation model',
      'Integrate with hospital management system',
      'Test with limited bed pool',
      'Scale to all departments',
    ],
    estimatedTimeframe: '3-4 months',
    confidence: 84,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'completed',
    assignedTo: 'IT Operations Team',
  },
];

// Mock Federated Learning Status
export const mockFederatedLearningStatus: FederatedLearningStatus[] = [
  {
    hospitalId: '1',
    hospitalName: 'General Hospital',
    modelVersion: '2.1.4',
    lastTrainingRun: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    trainingStatus: 'completed',
    contributedSamples: 15420,
    modelAccuracy: 94.2,
    nextScheduledTraining: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
    dataQualityScore: 97,
  },
  {
    hospitalId: '2',
    hospitalName: 'City Medical Center',
    modelVersion: '2.1.4',
    lastTrainingRun: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    trainingStatus: 'training',
    contributedSamples: 12890,
    modelAccuracy: 92.8,
    syncProgress: 67,
    nextScheduledTraining: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
    dataQualityScore: 93,
  },
  {
    hospitalId: '3',
    hospitalName: 'Regional Medical Center',
    modelVersion: '2.1.3',
    lastTrainingRun: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
    trainingStatus: 'error',
    contributedSamples: 8650,
    modelAccuracy: 89.1,
    errors: ['Network connectivity timeout', 'Data validation failed for batch #247'],
    nextScheduledTraining: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    dataQualityScore: 78,
  },
];

// Mock ML Gateway Status
export const mockMlGatewayStatus: MlGatewayStatus = {
  status: 'online',
  version: '1.3.2',
  lastHealthCheck: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  responseTime: 89,
  activeModels: [
    'KPI-Prediction-v2.1',
    'Anomaly-Detection-v1.8',
    'Risk-Assessment-v3.0',
    'Recommendation-Engine-v2.5',
  ],
  queueSize: 23,
  processedRequests24h: 1847,
  errorRate: 0.8,
  systemResources: {
    cpuUsage: 68.5,
    memoryUsage: 74.2,
    diskUsage: 45.8,
  },
};

// Helper function to get user by email (for login simulation)
export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find(user => user.email === email);
}

// Helper function to get hospital by user
export function getHospitalByUser(user: User): Hospital | undefined {
  if (!user.hospitalId) return undefined;
  return mockHospitals.find(hospital => hospital.id === user.hospitalId);
}

// Helper function to get departments by hospital
export function getDepartmentsByHospital(hospitalId: string): Department[] {
  return mockDepartments.filter(dept => dept.hospitalId === hospitalId);
}

// Helper function to simulate API delay
export function simulateApiDelay(ms: number = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}