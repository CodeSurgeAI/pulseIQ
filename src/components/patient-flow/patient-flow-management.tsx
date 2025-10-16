'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bed, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Brain,
  Shield,
  Target,
  Zap,
  Activity,
  Timer,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Plus,
  Users,
  MapPin,
  Calendar,
  Stethoscope,
  Heart,
  UserCheck,
  Ambulance,
  Building,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  LineChart,
  Navigation,
  Workflow
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { useTimeoutManager } from '@/hooks/use-timeout-manager';

// Types for Patient Flow & Bed Management
export interface BedStatus {
  id: string;
  room: string;
  unit: string;
  floor: number;
  bedType: 'ICU' | 'Medical' | 'Surgical' | 'Emergency' | 'Pediatric' | 'Maternity' | 'Psychiatric';
  status: 'occupied' | 'available' | 'cleaning' | 'maintenance' | 'reserved';
  patient?: {
    id: string;
    name: string;
    admissionDate: Date;
    diagnosisCode: string;
    acuityLevel: 1 | 2 | 3 | 4 | 5;
    predictedDischarge: Date;
    dischargeReadiness: number; // 0-100
  };
  lastUpdated: Date;
  estimatedTurnover: number; // minutes
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface EDMetrics {
  currentPatients: number;
  averageWaitTime: number;
  triageBacklog: number;
  bedRequests: number;
  predictedArrivals: {
    next1Hour: number;
    next4Hours: number;
    next8Hours: number;
  };
  acuityDistribution: {
    level1: number; // Critical
    level2: number; // Emergent
    level3: number; // Urgent
    level4: number; // Less Urgent
    level5: number; // Non-Urgent
  };
  bottleneckAreas: string[];
  flowRate: number; // patients per hour
  diversion: boolean;
}

export interface DischargePredictor {
  patientId: string;
  patientName: string;
  currentUnit: string;
  admissionDate: Date;
  diagnosisCode: string;
  predictedLOS: number; // days
  actualLOS: number; // days
  dischargeReadiness: number; // 0-100
  predictedDischargeDate: Date;
  confidenceLevel: number; // 0-100
  barriers: string[];
  recommendations: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ORSchedule {
  id: string;
  room: string;
  date: Date;
  startTime: Date;
  predictedDuration: number; // minutes
  actualDuration?: number; // minutes
  procedure: string;
  surgeon: string;
  patient: {
    id: string;
    name: string;
    age: number;
    complexity: 'low' | 'medium' | 'high';
  };
  equipment: string[];
  staff: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  delayReason?: string;
  turnoverTime: number; // minutes
  utilizationRate: number; // percentage
}

export interface FlowBottleneck {
  id: string;
  location: string;
  type: 'bed_shortage' | 'staffing' | 'equipment' | 'transport' | 'discharge_delay' | 'cleaning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  patientsAffected: number;
  estimatedDelay: number; // minutes
  recommendations: string[];
  timestamp: Date;
  resolved: boolean;
}

export interface PatientFlowMetrics {
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyRate: number;
  averageLOS: number;
  predictedDischarges: number;
  pendingAdmissions: number;
  edWaitTime: number;
  orUtilization: number;
  turnoverTime: number;
  bottleneckCount: number;
  flowEfficiency: number;
}

// Mock Data
const mockBedStatuses: BedStatus[] = [
  {
    id: '1',
    room: 'ICU-101',
    unit: 'ICU',
    floor: 3,
    bedType: 'ICU',
    status: 'occupied',
    patient: {
      id: 'P001',
      name: 'John Martinez',
      admissionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      diagnosisCode: 'Sepsis',
      acuityLevel: 5,
      predictedDischarge: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      dischargeReadiness: 45
    },
    lastUpdated: new Date(Date.now() - 1000 * 60 * 15),
    estimatedTurnover: 45,
    priority: 'high'
  },
  {
    id: '2',
    room: 'MS-204',
    unit: 'Medical Surgical',
    floor: 2,
    bedType: 'Medical',
    status: 'available',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 5),
    estimatedTurnover: 30,
    priority: 'medium'
  },
  {
    id: '3',
    room: 'ED-Bay4',
    unit: 'Emergency',
    floor: 1,
    bedType: 'Emergency',
    status: 'occupied',
    patient: {
      id: 'P002',
      name: 'Sarah Williams',
      admissionDate: new Date(Date.now() - 1000 * 60 * 60 * 8),
      diagnosisCode: 'Chest Pain',
      acuityLevel: 3,
      predictedDischarge: new Date(Date.now() + 1000 * 60 * 60 * 4),
      dischargeReadiness: 85
    },
    lastUpdated: new Date(Date.now() - 1000 * 60 * 2),
    estimatedTurnover: 15,
    priority: 'critical'
  }
];

const mockEDMetrics: EDMetrics = {
  currentPatients: 42,
  averageWaitTime: 125, // minutes
  triageBacklog: 8,
  bedRequests: 12,
  predictedArrivals: {
    next1Hour: 6,
    next4Hours: 18,
    next8Hours: 35
  },
  acuityDistribution: {
    level1: 2, // Critical
    level2: 5, // Emergent
    level3: 12, // Urgent
    level4: 15, // Less Urgent
    level5: 8 // Non-Urgent
  },
  bottleneckAreas: ['Imaging', 'Lab Results', 'Bed Assignment'],
  flowRate: 3.2,
  diversion: false
};

const mockDischargePredictions: DischargePredictor[] = [
  {
    patientId: 'P001',
    patientName: 'John Martinez',
    currentUnit: 'ICU',
    admissionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    diagnosisCode: 'Sepsis',
    predictedLOS: 5,
    actualLOS: 3,
    dischargeReadiness: 45,
    predictedDischargeDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    confidenceLevel: 87,
    barriers: ['Awaiting culture results', 'Family conference needed'],
    recommendations: ['Schedule family meeting', 'Expedite lab results'],
    priority: 'high'
  },
  {
    patientId: 'P002',
    patientName: 'Sarah Williams',
    currentUnit: 'Emergency',
    admissionDate: new Date(Date.now() - 1000 * 60 * 60 * 8),
    diagnosisCode: 'Chest Pain',
    predictedLOS: 0.5,
    actualLOS: 0.33,
    dischargeReadiness: 85,
    predictedDischargeDate: new Date(Date.now() + 1000 * 60 * 60 * 4),
    confidenceLevel: 92,
    barriers: ['Cardiology consult pending'],
    recommendations: ['Expedite cardiology review', 'Prepare discharge planning'],
    priority: 'medium'
  }
];

const mockORSchedule: ORSchedule[] = [
  {
    id: '1',
    room: 'OR-1',
    date: new Date(),
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 2),
    predictedDuration: 180,
    procedure: 'Coronary Artery Bypass',
    surgeon: 'Dr. Thompson',
    patient: {
      id: 'P003',
      name: 'Robert Chen',
      age: 65,
      complexity: 'high'
    },
    equipment: ['Heart-Lung Machine', 'Surgical Robot'],
    staff: ['Dr. Thompson', 'Nurse Wilson', 'Tech Davis'],
    status: 'scheduled',
    turnoverTime: 45,
    utilizationRate: 85
  },
  {
    id: '2',
    room: 'OR-2',
    date: new Date(),
    startTime: new Date(Date.now() + 1000 * 60 * 30),
    predictedDuration: 90,
    actualDuration: 105,
    procedure: 'Laparoscopic Cholecystectomy',
    surgeon: 'Dr. Rodriguez',
    patient: {
      id: 'P004',
      name: 'Maria Garcia',
      age: 42,
      complexity: 'medium'
    },
    equipment: ['Laparoscopic Tower'],
    staff: ['Dr. Rodriguez', 'Nurse Johnson'],
    status: 'in_progress',
    turnoverTime: 30,
    utilizationRate: 92
  }
];

const mockBottlenecks: FlowBottleneck[] = [
  {
    id: '1',
    location: 'Emergency Department',
    type: 'bed_shortage',
    severity: 'critical',
    description: 'No available beds for admission, 12 patients boarding in ED',
    impact: 'ED overcrowding, increased wait times, potential diversion',
    patientsAffected: 12,
    estimatedDelay: 180,
    recommendations: [
      'Expedite discharges from medical floors',
      'Open overflow unit if available',
      'Consider diversion protocols'
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    resolved: false
  },
  {
    id: '2',
    location: 'OR Suite 3',
    type: 'equipment',
    severity: 'high',
    description: 'Surgical robot malfunction causing case delays',
    impact: 'Two surgeries delayed, OR utilization reduced',
    patientsAffected: 2,
    estimatedDelay: 120,
    recommendations: [
      'Activate backup equipment protocol',
      'Reschedule non-urgent cases',
      'Contact vendor for emergency repair'
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    resolved: false
  }
];

const mockPatientFlowMetrics: PatientFlowMetrics = {
  totalBeds: 320,
  occupiedBeds: 285,
  availableBeds: 35,
  occupancyRate: 89,
  averageLOS: 4.2,
  predictedDischarges: 28,
  pendingAdmissions: 15,
  edWaitTime: 125,
  orUtilization: 88,
  turnoverTime: 32,
  bottleneckCount: 3,
  flowEfficiency: 76
};

interface PatientFlowManagementProps {
  className?: string;
}

export function PatientFlowManagement({ className }: PatientFlowManagementProps) {
  const { showAlert } = useAlert();
  const { showSuccess, showInfo, showWarning, showError } = useToast();
  const { scheduleTimeout } = useTimeoutManager();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'beds' | 'discharge' | 'ed_flow' | 'or_schedule' | 'analytics'>('overview');
  const [bedStatuses] = useState<BedStatus[]>(mockBedStatuses);
  const [edMetrics] = useState<EDMetrics>(mockEDMetrics);
  const [dischargePredictions] = useState<DischargePredictor[]>(mockDischargePredictions);
  const [orSchedule] = useState<ORSchedule[]>(mockORSchedule);
  const [bottlenecks, setBottlenecks] = useState<FlowBottleneck[]>(mockBottlenecks);
  const [metrics] = useState<PatientFlowMetrics>(mockPatientFlowMetrics);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    showInfo('Refreshing', 'Updating AI patient flow predictions and bed management analytics...');
    
    scheduleTimeout(() => {
      setIsRefreshing(false);
      showSuccess('Data Updated', 'Patient flow intelligence refreshed with latest AI predictions');
    }, 2000);
  };

  const handleResolveBottleneck = (bottleneckId: string) => {
    setBottlenecks(prev => prev.map(bottleneck => 
      bottleneck.id === bottleneckId ? { ...bottleneck, resolved: true } : bottleneck
    ));
    showSuccess('Bottleneck Resolved', 'Flow bottleneck has been marked as resolved');
  };

  const handleOptimizeFlow = () => {
    showAlert({
      type: 'info',
      title: 'AI Flow Optimization',
      message: 'Implementing AI recommendations:\n\n• Expedite 3 ready discharges\n• Redirect 2 ED patients to available beds\n• Optimize OR turnover times\n• Activate overflow protocols\n\nExpected improvement: 15-20 minute reduction in average wait time'
    });
  };

  const getBedStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50 border-green-200';
      case 'occupied': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cleaning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'maintenance': return 'text-red-600 bg-red-50 border-red-200';
      case 'reserved': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAcuityColor = (level: number) => {
    switch (level) {
      case 5: return 'text-red-600 bg-red-100';
      case 4: return 'text-orange-600 bg-orange-100';
      case 3: return 'text-yellow-600 bg-yellow-100';
      case 2: return 'text-blue-600 bg-blue-100';
      case 1: return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const criticalBottlenecks = bottlenecks.filter(b => b.severity === 'critical' && !b.resolved);
  const highOccupancy = metrics.occupancyRate > 85;
  const longWaitTime = metrics.edWaitTime > 120;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bed className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Flow & Bed Management</h1>
            <p className="text-sm text-gray-500">AI-Powered Flow Optimization & Bottleneck Prevention</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="info"
            onClick={handleOptimizeFlow}
            className="flex items-center space-x-2"
          >
            <Brain className="h-4 w-4" />
            <span>AI Optimize Flow</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={highOccupancy ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${highOccupancy ? 'text-orange-600' : 'text-green-600'}`}>
                  Bed Occupancy
                </p>
                <p className={`text-2xl font-bold ${highOccupancy ? 'text-orange-700' : 'text-green-700'}`}>
                  {metrics.occupancyRate}%
                </p>
                <p className={`text-xs ${highOccupancy ? 'text-orange-500' : 'text-green-500'}`}>
                  {metrics.availableBeds} beds available
                </p>
              </div>
              <Bed className={`h-8 w-8 ${highOccupancy ? 'text-orange-600' : 'text-green-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={longWaitTime ? "border-red-200 bg-red-50" : "border-blue-200 bg-blue-50"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${longWaitTime ? 'text-red-600' : 'text-blue-600'}`}>
                  ED Wait Time
                </p>
                <p className={`text-2xl font-bold ${longWaitTime ? 'text-red-700' : 'text-blue-700'}`}>
                  {Math.round(metrics.edWaitTime / 60)}h {metrics.edWaitTime % 60}m
                </p>
                <p className={`text-xs ${longWaitTime ? 'text-red-500' : 'text-blue-500'}`}>
                  {edMetrics.currentPatients} patients in ED
                </p>
              </div>
              <Ambulance className={`h-8 w-8 ${longWaitTime ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">OR Utilization</p>
                <p className="text-2xl font-bold text-purple-700">{metrics.orUtilization}%</p>
                <p className="text-xs text-purple-500">{orSchedule.length} cases scheduled</p>
              </div>
              <Stethoscope className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={criticalBottlenecks.length > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${criticalBottlenecks.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  Active Bottlenecks
                </p>
                <p className={`text-2xl font-bold ${criticalBottlenecks.length > 0 ? 'text-red-700' : 'text-green-700'}`}>
                  {criticalBottlenecks.length}
                </p>
                <p className={`text-xs ${criticalBottlenecks.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {bottlenecks.filter(b => !b.resolved).length} total issues
                </p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${criticalBottlenecks.length > 0 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'beds', label: 'Real-Time Beds', icon: Bed },
            { id: 'discharge', label: 'Discharge Planning', icon: UserCheck },
            { id: 'ed_flow', label: 'ED Flow', icon: Ambulance },
            { id: 'or_schedule', label: 'OR Scheduling', icon: Calendar },
            { id: 'analytics', label: 'Flow Analytics', icon: BarChart3 }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as 'overview' | 'beds' | 'discharge' | 'ed_flow' | 'or_schedule' | 'analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Bottlenecks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Critical Flow Bottlenecks</span>
              </CardTitle>
              <CardDescription>
                Areas causing patient flow delays and requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bottlenecks.filter(b => !b.resolved).slice(0, 3).map(bottleneck => (
                <div key={bottleneck.id} className={`border rounded-lg p-4 ${getSeverityColor(bottleneck.severity)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold">{bottleneck.location}</h4>
                      <p className="text-sm mt-1">{bottleneck.description}</p>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Patients Affected:</span>
                          <span className="font-medium ml-1">{bottleneck.patientsAffected}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Est. Delay:</span>
                          <span className="font-medium ml-1">{bottleneck.estimatedDelay} min</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1">AI Recommendations:</p>
                        <ul className="text-xs space-y-1">
                          {bottleneck.recommendations.slice(0, 2).map((rec, idx) => (
                            <li key={idx} className="flex items-start space-x-1">
                              <span className="text-gray-400 mt-0.5">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolveBottleneck(bottleneck.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Discharge Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <span>AI Discharge Predictions</span>
              </CardTitle>
              <CardDescription>
                Predictive discharge planning to optimize bed turnover
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dischargePredictions.slice(0, 2).map(prediction => (
                <div key={prediction.patientId} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-blue-900">{prediction.patientName}</h4>
                      <p className="text-sm text-blue-700">{prediction.currentUnit} • {prediction.diagnosisCode}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{prediction.dischargeReadiness}%</div>
                      <div className="text-xs text-blue-500">Ready</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-blue-600">Predicted Discharge:</span>
                      <div className="font-medium">{prediction.predictedDischargeDate.toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-blue-600">Confidence:</span>
                      <div className="font-medium text-green-600">{prediction.confidenceLevel}%</div>
                    </div>
                  </div>
                  
                  {prediction.barriers.length > 0 && (
                    <div className="text-xs">
                      <strong>Barriers:</strong> {prediction.barriers.join(', ')}
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs">
                    <strong>Recommendations:</strong>
                    <ul className="mt-1 space-y-1">
                      {prediction.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start space-x-1">
                          <ArrowRight className="h-3 w-3 text-blue-500 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'beds' && (
        <div className="space-y-6">
          {/* Bed Occupancy Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Building className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{metrics.totalBeds}</div>
                <div className="text-sm text-gray-600">Total Beds</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{metrics.occupiedBeds}</div>
                <div className="text-sm text-gray-600">Occupied</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{metrics.availableBeds}</div>
                <div className="text-sm text-gray-600">Available</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Timer className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{metrics.turnoverTime}</div>
                <div className="text-sm text-gray-600">Avg Turnover (min)</div>
              </CardContent>
            </Card>
          </div>

          {/* Real-Time Bed Status */}
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Bed Management</CardTitle>
              <CardDescription>
                Live bed availability across hospital network with predictive analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bedStatuses.map(bed => (
                  <div key={bed.id} className={`border rounded-lg p-4 ${getBedStatusColor(bed.status)}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{bed.room}</h3>
                        <p className="text-sm">{bed.unit} • Floor {bed.floor} • {bed.bedType}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getBedStatusColor(bed.status)}`}>
                        {bed.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    
                    {bed.patient && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm font-medium">Patient: {bed.patient.name}</p>
                          <p className="text-xs">Admitted: {bed.patient.admissionDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm">Diagnosis: {bed.patient.diagnosisCode}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs">Acuity:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAcuityColor(bed.patient.acuityLevel)}`}>
                              Level {bed.patient.acuityLevel}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm">Discharge Readiness: {bed.patient.dischargeReadiness}%</p>
                          <p className="text-xs">Predicted: {bed.patient.predictedDischarge.toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs">
                        <strong>Last Updated:</strong> {bed.lastUpdated.toLocaleTimeString()}
                      </div>
                      <div className="text-xs">
                        <strong>Est. Turnover:</strong> {bed.estimatedTurnover} minutes
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'discharge' && (
        <div className="space-y-6">
          {/* Discharge Planning Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{metrics.predictedDischarges}</div>
                <div className="text-sm text-gray-600">Predicted Today</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{metrics.averageLOS}</div>
                <div className="text-sm text-gray-600">Avg LOS (days)</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{metrics.pendingAdmissions}</div>
                <div className="text-sm text-gray-600">Pending Admits</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Discharge Predictions */}
          <div className="space-y-4">
            {dischargePredictions.map(prediction => (
              <Card key={prediction.patientId}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{prediction.patientName}</h3>
                      <p className="text-sm text-gray-600">{prediction.currentUnit} • {prediction.diagnosisCode}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{prediction.dischargeReadiness}%</div>
                      <div className="text-sm text-green-500">Discharge Ready</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Timeline */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Timeline Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Admission:</span>
                          <span className="font-medium">{prediction.admissionDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current LOS:</span>
                          <span className="font-medium">{prediction.actualLOS} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Predicted LOS:</span>
                          <span className="font-medium">{prediction.predictedLOS} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Target Discharge:</span>
                          <span className="font-medium text-blue-600">{prediction.predictedDischargeDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>AI Confidence:</span>
                          <span className="font-medium text-green-600">{prediction.confidenceLevel}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Barriers */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Discharge Barriers</h4>
                      <div className="space-y-2">
                        {prediction.barriers.length > 0 ? (
                          prediction.barriers.map((barrier, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{barrier}</span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-600">No barriers identified</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">AI Recommendations</h4>
                      <div className="space-y-2">
                        {prediction.recommendations.map((recommendation, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'ed_flow' && (
        <div className="space-y-6">
          {/* ED Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className={longWaitTime ? "border-red-200 bg-red-50" : "border-blue-200 bg-blue-50"}>
              <CardContent className="p-4 text-center">
                <Clock className={`h-8 w-8 mx-auto mb-2 ${longWaitTime ? 'text-red-600' : 'text-blue-600'}`} />
                <div className={`text-2xl font-bold ${longWaitTime ? 'text-red-700' : 'text-blue-700'}`}>
                  {Math.round(edMetrics.averageWaitTime)}m
                </div>
                <div className={`text-sm ${longWaitTime ? 'text-red-600' : 'text-blue-600'}`}>Avg Wait Time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{edMetrics.currentPatients}</div>
                <div className="text-sm text-gray-600">Current Patients</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{edMetrics.flowRate}</div>
                <div className="text-sm text-gray-600">Flow Rate (pt/hr)</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{edMetrics.triageBacklog}</div>
                <div className="text-sm text-gray-600">Triage Backlog</div>
              </CardContent>
            </Card>
          </div>

          {/* Acuity Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <span>Patient Acuity Distribution</span>
              </CardTitle>
              <CardDescription>
                Current patient mix by emergency severity level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {[
                  { level: 1, name: 'Critical', count: edMetrics.acuityDistribution.level1, color: 'red' },
                  { level: 2, name: 'Emergent', count: edMetrics.acuityDistribution.level2, color: 'orange' },
                  { level: 3, name: 'Urgent', count: edMetrics.acuityDistribution.level3, color: 'yellow' },
                  { level: 4, name: 'Less Urgent', count: edMetrics.acuityDistribution.level4, color: 'blue' },
                  { level: 5, name: 'Non-Urgent', count: edMetrics.acuityDistribution.level5, color: 'green' }
                ].map(acuity => (
                  <div key={acuity.level} className={`text-center p-4 bg-${acuity.color}-50 rounded-lg border border-${acuity.color}-200`}>
                    <div className={`text-2xl font-bold text-${acuity.color}-600`}>{acuity.count}</div>
                    <div className={`text-sm text-${acuity.color}-700`}>Level {acuity.level}</div>
                    <div className={`text-xs text-${acuity.color}-500`}>{acuity.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Predicted Arrivals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>AI Arrival Predictions</span>
              </CardTitle>
              <CardDescription>
                Predicted patient volumes for capacity planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{edMetrics.predictedArrivals.next1Hour}</div>
                  <div className="text-sm text-blue-700">Next Hour</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{edMetrics.predictedArrivals.next4Hours}</div>
                  <div className="text-sm text-blue-700">Next 4 Hours</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{edMetrics.predictedArrivals.next8Hours}</div>
                  <div className="text-sm text-blue-700">Next 8 Hours</div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Current Bottleneck Areas:</h4>
                <div className="flex flex-wrap gap-2">
                  {edMetrics.bottleneckAreas.map((area, idx) => (
                    <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'or_schedule' && (
        <div className="space-y-6">
          {/* OR Utilization */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Stethoscope className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{metrics.orUtilization}%</div>
                <div className="text-sm text-gray-600">OR Utilization</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{orSchedule.length}</div>
                <div className="text-sm text-gray-600">Cases Today</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Timer className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {orSchedule.reduce((sum, c) => sum + c.turnoverTime, 0) / orSchedule.length}
                </div>
                <div className="text-sm text-gray-600">Avg Turnover (min)</div>
              </CardContent>
            </Card>
          </div>

          {/* OR Schedule */}
          <div className="space-y-4">
            {orSchedule.map(surgery => (
              <Card key={surgery.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{surgery.procedure}</h3>
                      <p className="text-sm text-gray-600">{surgery.room} • Dr. {surgery.surgeon}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      surgery.status === 'completed' ? 'bg-green-100 text-green-700' :
                      surgery.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      surgery.status === 'delayed' ? 'bg-orange-100 text-orange-700' :
                      surgery.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {surgery.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Patient & Timing */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Patient & Timing</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Patient:</span>
                          <span className="font-medium">{surgery.patient.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Age:</span>
                          <span className="font-medium">{surgery.patient.age}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Complexity:</span>
                          <span className={`font-medium ${
                            surgery.patient.complexity === 'high' ? 'text-red-600' :
                            surgery.patient.complexity === 'medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {surgery.patient.complexity.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Start Time:</span>
                          <span className="font-medium">{surgery.startTime.toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Predicted Duration:</span>
                          <span className="font-medium">{surgery.predictedDuration} min</span>
                        </div>
                        {surgery.actualDuration && (
                          <div className="flex justify-between">
                            <span>Actual Duration:</span>
                            <span className={`font-medium ${
                              surgery.actualDuration > surgery.predictedDuration ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {surgery.actualDuration} min
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Resources Required</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Equipment:</span>
                          <div className="mt-1">
                            {surgery.equipment.map((eq, idx) => (
                              <span key={idx} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs mr-1 mb-1">
                                {eq}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Staff:</span>
                          <div className="mt-1">
                            {surgery.staff.map((staff, idx) => (
                              <span key={idx} className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs mr-1 mb-1">
                                {staff}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Utilization Rate:</span>
                          <span className="font-medium text-blue-600">{surgery.utilizationRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Turnover Time:</span>
                          <span className="font-medium">{surgery.turnoverTime} min</span>
                        </div>
                        {surgery.delayReason && (
                          <div>
                            <span>Delay Reason:</span>
                            <div className="text-orange-600 font-medium">{surgery.delayReason}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flow Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Flow Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{metrics.flowEfficiency}%</div>
                    <div className="text-sm text-blue-700">Flow Efficiency</div>
                    <div className="text-xs text-blue-500">Patient throughput</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{metrics.turnoverTime}</div>
                    <div className="text-sm text-green-700">Avg Turnover</div>
                    <div className="text-xs text-green-500">Minutes per bed</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{metrics.averageLOS}</div>
                    <div className="text-sm text-purple-700">Average LOS</div>
                    <div className="text-xs text-purple-500">Days per patient</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{metrics.orUtilization}%</div>
                    <div className="text-sm text-orange-700">OR Utilization</div>
                    <div className="text-xs text-orange-500">Surgical efficiency</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>ROI Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">AI Patient Flow Benefits:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Reduced ED Wait Times:</span>
                      <span className="font-medium text-green-600">+$320K/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bed Utilization Optimization:</span>
                      <span className="font-medium text-green-600">+$280K/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>OR Schedule Efficiency:</span>
                      <span className="font-medium text-green-600">+$195K/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Length of Stay Reduction:</span>
                      <span className="font-medium text-green-600">+$225K/month</span>
                    </div>
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">$1.02M</div>
                  <div className="text-sm text-green-700">Total Monthly Benefits</div>
                  <div className="text-xs text-green-500">$12.2M annualized ROI</div>
                </div>
                <div className="text-center text-xs text-gray-600">
                  <p>Addressing $1.4B market opportunity by 2026</p>
                  <p>AI-powered bottleneck prevention and flow optimization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
