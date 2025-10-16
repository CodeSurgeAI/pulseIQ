'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Brain,
  Shield,
  Target,
  Award,
  Zap,
  Activity,
  Heart,
  RefreshCw,
  UserCheck,
  UserX,
  BookOpen,
  BarChart3,
  Bell,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { useTimeoutManager } from '@/hooks/use-timeout-manager';

// Types for Workforce Management
export interface StaffMember {
  id: string;
  name: string;
  role: 'RN' | 'LPN' | 'CNA' | 'Physician' | 'Resident' | 'NP' | 'PA' | 'Tech';
  department: string;
  shiftPreference: 'day' | 'night' | 'swing' | 'flexible';
  experienceYears: number;
  burnoutRisk: 'low' | 'medium' | 'high' | 'critical';
  burnoutScore: number; // 0-100
  skills: string[];
  certifications: string[];
  patientCapacity: number;
  currentAssignment?: string;
  hoursWorked: {
    thisWeek: number;
    lastWeek: number;
    overtime: number;
  };
  performanceScore: number;
  lastAssessment: Date;
  trainingNeeds: string[];
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

export interface PatientLoad {
  department: string;
  shift: 'day' | 'night' | 'swing';
  date: Date;
  predictedCensus: number;
  currentCensus: number;
  acuityScore: number; // 1-5 scale
  requiredStaff: {
    RN: number;
    LPN: number;
    CNA: number;
    total: number;
  };
  currentStaff: {
    RN: number;
    LPN: number;
    CNA: number;
    total: number;
  };
  ratioCompliance: boolean;
  shortfall: number;
}

export interface BurnoutAlert {
  id: string;
  staffId: string;
  staffName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'hours' | 'consecutive_days' | 'patient_load' | 'stress_indicators';
  description: string;
  recommendations: string[];
  timestamp: Date;
  acknowledged: boolean;
}

export interface SkillGap {
  id: string;
  department: string;
  skillName: string;
  requiredLevel: number;
  currentLevel: number;
  staffAffected: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  trainingPlan: string;
  estimatedCost: number;
  completionTarget: Date;
}

export interface ScheduleRecommendation {
  id: string;
  type: 'staffing_increase' | 'shift_adjustment' | 'skill_match' | 'burnout_prevention';
  department: string;
  shift: string;
  date: Date;
  description: string;
  staffRecommendations: {
    staffId: string;
    staffName: string;
    reason: string;
    confidence: number;
  }[];
  expectedOutcome: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Mock Data
const mockStaffMembers: StaffMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson, RN',
    role: 'RN',
    department: 'ICU',
    shiftPreference: 'day',
    experienceYears: 8,
    burnoutRisk: 'high',
    burnoutScore: 78,
    skills: ['Critical Care', 'Ventilator Management', 'ECMO', 'Medication Administration'],
    certifications: ['BLS', 'ACLS', 'CCRN'],
    patientCapacity: 2,
    currentAssignment: 'ICU-204, ICU-206',
    hoursWorked: {
      thisWeek: 48,
      lastWeek: 52,
      overtime: 8
    },
    performanceScore: 94,
    lastAssessment: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    trainingNeeds: ['ECMO Certification Renewal'],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    }
  },
  {
    id: '2',
    name: 'Michael Chen, RN',
    role: 'RN',
    department: 'Emergency',
    shiftPreference: 'night',
    experienceYears: 12,
    burnoutRisk: 'medium',
    burnoutScore: 45,
    skills: ['Trauma Care', 'Triage', 'IV Therapy', 'Patient Education'],
    certifications: ['BLS', 'ACLS', 'PALS', 'TNCC'],
    patientCapacity: 4,
    currentAssignment: 'ED-Bay 1-4',
    hoursWorked: {
      thisWeek: 36,
      lastWeek: 40,
      overtime: 0
    },
    performanceScore: 96,
    lastAssessment: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    trainingNeeds: [],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    }
  },
  {
    id: '3',
    name: 'Emily Rodriguez, LPN',
    role: 'LPN',
    department: 'Medical Surgical',
    shiftPreference: 'day',
    experienceYears: 5,
    burnoutRisk: 'critical',
    burnoutScore: 89,
    skills: ['Medication Administration', 'Wound Care', 'Patient Assessment'],
    certifications: ['BLS', 'Wound Care Certified'],
    patientCapacity: 6,
    currentAssignment: 'Med-Surg Wing A',
    hoursWorked: {
      thisWeek: 54,
      lastWeek: 48,
      overtime: 14
    },
    performanceScore: 88,
    lastAssessment: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    trainingNeeds: ['Advanced Wound Care', 'Stress Management'],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    }
  }
];

const mockPatientLoads: PatientLoad[] = [
  {
    department: 'ICU',
    shift: 'day',
    date: new Date(),
    predictedCensus: 24,
    currentCensus: 22,
    acuityScore: 4.2,
    requiredStaff: {
      RN: 12,
      LPN: 2,
      CNA: 6,
      total: 20
    },
    currentStaff: {
      RN: 10,
      LPN: 2,
      CNA: 5,
      total: 17
    },
    ratioCompliance: false,
    shortfall: 3
  },
  {
    department: 'Emergency',
    shift: 'day',
    date: new Date(),
    predictedCensus: 45,
    currentCensus: 42,
    acuityScore: 3.8,
    requiredStaff: {
      RN: 15,
      LPN: 3,
      CNA: 8,
      total: 26
    },
    currentStaff: {
      RN: 14,
      LPN: 3,
      CNA: 7,
      total: 24
    },
    ratioCompliance: true,
    shortfall: 2
  },
  {
    department: 'Medical Surgical',
    shift: 'day',
    date: new Date(),
    predictedCensus: 38,
    currentCensus: 36,
    acuityScore: 2.5,
    requiredStaff: {
      RN: 8,
      LPN: 6,
      CNA: 12,
      total: 26
    },
    currentStaff: {
      RN: 8,
      LPN: 5,
      CNA: 11,
      total: 24
    },
    ratioCompliance: true,
    shortfall: 2
  }
];

const mockBurnoutAlerts: BurnoutAlert[] = [
  {
    id: '1',
    staffId: '3',
    staffName: 'Emily Rodriguez, LPN',
    severity: 'critical',
    type: 'hours',
    description: 'Working 54 hours this week with 14 hours overtime. Critical burnout risk detected.',
    recommendations: [
      'Immediate schedule adjustment required',
      'Reduce patient load for next 48 hours',
      'Mandatory rest period of 16 hours',
      'Consider temporary assignment to lower acuity unit'
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    acknowledged: false
  },
  {
    id: '2',
    staffId: '1',
    staffName: 'Sarah Johnson, RN',
    severity: 'high',
    type: 'consecutive_days',
    description: 'Working 7 consecutive days with high-acuity patients. Stress indicators elevated.',
    recommendations: [
      'Schedule 2 consecutive days off',
      'Assign mentor for emotional support',
      'Recommend wellness program participation',
      'Monitor for signs of compassion fatigue'
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    acknowledged: true
  }
];

const mockSkillGaps: SkillGap[] = [
  {
    id: '1',
    department: 'ICU',
    skillName: 'ECMO Management',
    requiredLevel: 4,
    currentLevel: 2.5,
    staffAffected: 8,
    priority: 'high',
    trainingPlan: '40-hour ECMO certification program',
    estimatedCost: 15000,
    completionTarget: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60)
  },
  {
    id: '2',
    department: 'Emergency',
    skillName: 'Pediatric Trauma',
    requiredLevel: 3,
    currentLevel: 2.0,
    staffAffected: 12,
    priority: 'medium',
    trainingPlan: 'PALS and Pediatric Trauma certification',
    estimatedCost: 8000,
    completionTarget: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45)
  }
];

const mockScheduleRecommendations: ScheduleRecommendation[] = [
  {
    id: '1',
    type: 'burnout_prevention',
    department: 'Medical Surgical',
    shift: 'Day Shift',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    description: 'Emily Rodriguez requires immediate schedule adjustment to prevent burnout',
    staffRecommendations: [
      {
        staffId: '4',
        staffName: 'David Kim, LPN',
        reason: 'Available and qualified for Med-Surg assignment',
        confidence: 92
      },
      {
        staffId: '5',
        staffName: 'Lisa Wang, RN',
        reason: 'Cross-trained in Med-Surg, can provide coverage',
        confidence: 88
      }
    ],
    expectedOutcome: 'Reduce Emily\'s burnout risk from critical to medium within 48 hours',
    priority: 'critical'
  },
  {
    id: '2',
    type: 'staffing_increase',
    department: 'ICU',
    shift: 'Day Shift',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    description: 'Predicted high acuity patients require additional RN coverage',
    staffRecommendations: [
      {
        staffId: '6',
        staffName: 'Jennifer Brown, RN',
        reason: 'ICU-experienced, available for overtime',
        confidence: 95
      }
    ],
    expectedOutcome: 'Maintain 2:1 nurse-to-patient ratio in ICU',
    priority: 'high'
  }
];

interface WorkforceManagementProps {
  className?: string;
}

export function WorkforceManagement({ className }: WorkforceManagementProps) {
  const { showAlert } = useAlert();
  const { showSuccess, showInfo, showWarning, showError } = useToast();
  const { scheduleTimeout } = useTimeoutManager();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'scheduling' | 'burnout' | 'skills' | 'analytics'>('overview');
  const [staffMembers] = useState<StaffMember[]>(mockStaffMembers);
  const [patientLoads] = useState<PatientLoad[]>(mockPatientLoads);
  const [burnoutAlerts, setBurnoutAlerts] = useState<BurnoutAlert[]>(mockBurnoutAlerts);
  const [skillGaps] = useState<SkillGap[]>(mockSkillGaps);
  const [scheduleRecommendations] = useState<ScheduleRecommendation[]>(mockScheduleRecommendations);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    showInfo('Refreshing', 'Updating AI workforce predictions and staffing analytics...');
    
    scheduleTimeout(() => {
      setIsRefreshing(false);
      showSuccess('Data Updated', 'Workforce management data refreshed with latest AI predictions');
    }, 2000);
  };

  const handleAcknowledgeBurnoutAlert = (alertId: string) => {
    setBurnoutAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    showSuccess('Alert Acknowledged', 'Burnout alert has been reviewed and acknowledged');
  };

  const handleImplementRecommendation = (recommendationId: string) => {
    const recommendation = scheduleRecommendations.find(r => r.id === recommendationId);
    if (recommendation) {
      showAlert({
        type: 'info',
        title: 'Implementing Schedule Recommendation',
        message: `Implementing staffing recommendation for ${recommendation.department}:\n\n${recommendation.description}\n\nExpected outcome: ${recommendation.expectedOutcome}`
      });
    }
  };

  const getBurnoutRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const criticalBurnoutAlerts = burnoutAlerts.filter(a => a.severity === 'critical' && !a.acknowledged);
  const highRiskStaff = staffMembers.filter(s => s.burnoutRisk === 'critical' || s.burnoutRisk === 'high');
  const totalStaffShortfall = patientLoads.reduce((sum, load) => sum + load.shortfall, 0);
  const averageBurnoutScore = staffMembers.reduce((sum, staff) => sum + staff.burnoutScore, 0) / staffMembers.length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workforce Management</h1>
            <p className="text-sm text-gray-500">AI-Powered Staffing Optimization & Burnout Prevention</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleRefreshData}
          disabled={isRefreshing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh AI Predictions</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Critical Burnout Risk</p>
                <p className="text-2xl font-bold text-red-700">{criticalBurnoutAlerts.length}</p>
                <p className="text-xs text-red-500">Staff require immediate attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">High Risk Staff</p>
                <p className="text-2xl font-bold text-orange-700">{highRiskStaff.length}</p>
                <p className="text-xs text-orange-500">Enhanced monitoring needed</p>
              </div>
              <Heart className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Staffing Shortfall</p>
                <p className="text-2xl font-bold text-yellow-700">{totalStaffShortfall}</p>
                <p className="text-xs text-yellow-500">Positions need coverage</p>
              </div>
              <UserX className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Avg Burnout Score</p>
                <p className="text-2xl font-bold text-blue-700">{Math.round(averageBurnoutScore)}</p>
                <p className="text-xs text-blue-500">Lower is better (0-100 scale)</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'scheduling', label: 'AI Scheduling', icon: Calendar },
            { id: 'burnout', label: 'Burnout Prevention', icon: Heart },
            { id: 'skills', label: 'Skills Analysis', icon: BookOpen },
            { id: 'analytics', label: 'Workforce Analytics', icon: BarChart3 }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as 'overview' | 'scheduling' | 'burnout' | 'skills' | 'analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  selectedTab === tab.id
                    ? 'border-purple-500 text-purple-600'
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
          {/* Critical Burnout Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Critical Burnout Alerts</span>
              </CardTitle>
              <CardDescription>
                Staff members requiring immediate intervention to prevent burnout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {criticalBurnoutAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900">{alert.staffName}</h4>
                      <p className="text-sm text-red-700 mt-1">{alert.description}</p>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-red-600 mb-1">Immediate Actions:</p>
                        <ul className="text-xs text-red-600 space-y-1">
                          {alert.recommendations.slice(0, 2).map((rec, idx) => (
                            <li key={idx} className="flex items-start space-x-1">
                              <span className="text-red-400 mt-0.5">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAcknowledgeBurnoutAlert(alert.id)}
                      className="ml-3"
                    >
                      Take Action
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Schedule Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI Schedule Recommendations</span>
              </CardTitle>
              <CardDescription>
                Predictive staffing suggestions based on patient acuity and load
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scheduleRecommendations.slice(0, 2).map(recommendation => (
                <div key={recommendation.id} className={`border rounded-lg p-4 ${getPriorityColor(recommendation.priority)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{recommendation.department} - {recommendation.shift}</h4>
                      <p className="text-sm mt-1">{recommendation.description}</p>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getPriorityColor(recommendation.priority)}`}>
                        {recommendation.priority.toUpperCase()} Priority
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => handleImplementRecommendation(recommendation.id)}
                    >
                      Implement
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Recommended Staff:</h5>
                    {recommendation.staffRecommendations.map((staff, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span>{staff.staffName}</span>
                        <span className="font-medium">{staff.confidence}% match</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 text-xs">
                    <strong>Expected Outcome:</strong> {recommendation.expectedOutcome}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'scheduling' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Load Predictions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>AI Patient Load Predictions</span>
                </CardTitle>
                <CardDescription>
                  Real-time census and acuity predictions with staffing requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientLoads.map((load, idx) => (
                    <div key={idx} className={`border rounded-lg p-4 ${!load.ratioCompliance ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{load.department}</h3>
                          <p className="text-sm text-gray-600">{load.shift} shift</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          load.ratioCompliance ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {load.ratioCompliance ? 'Compliant' : `${load.shortfall} Short`}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Predicted Census</p>
                          <p className="font-bold text-lg">{load.predictedCensus}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Current Census</p>
                          <p className="font-bold text-lg">{load.currentCensus}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Acuity Score</p>
                          <p className="font-bold text-lg">{load.acuityScore}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Staff Ratio</p>
                          <p className="font-bold text-lg">{load.currentStaff.total}/{load.requiredStaff.total}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-white rounded">
                          <div className="font-medium">RN</div>
                          <div className={load.currentStaff.RN < load.requiredStaff.RN ? 'text-red-600' : 'text-green-600'}>
                            {load.currentStaff.RN}/{load.requiredStaff.RN}
                          </div>
                        </div>
                        <div className="text-center p-2 bg-white rounded">
                          <div className="font-medium">LPN</div>
                          <div className={load.currentStaff.LPN < load.requiredStaff.LPN ? 'text-red-600' : 'text-green-600'}>
                            {load.currentStaff.LPN}/{load.requiredStaff.LPN}
                          </div>
                        </div>
                        <div className="text-center p-2 bg-white rounded">
                          <div className="font-medium">CNA</div>
                          <div className={load.currentStaff.CNA < load.requiredStaff.CNA ? 'text-red-600' : 'text-green-600'}>
                            {load.currentStaff.CNA}/{load.requiredStaff.CNA}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Staffing Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span>Next 24hrs</span>
                </CardTitle>
                <CardDescription>
                  AI-driven staffing recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {scheduleRecommendations.map(rec => (
                  <div key={rec.id} className={`p-3 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{rec.department}</span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-white">
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs mb-2">{rec.description}</p>
                    <div className="space-y-1">
                      {rec.staffRecommendations.slice(0, 1).map((staff, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span>{staff.staffName}</span>
                          <span>{staff.confidence}%</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => handleImplementRecommendation(rec.id)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {selectedTab === 'burnout' && (
        <div className="space-y-4">
          {/* Staff Burnout Analysis */}
          {staffMembers.map(staff => (
            <Card key={staff.id} className={`border-l-4 ${getBurnoutRiskColor(staff.burnoutRisk).includes('red') ? 'border-l-red-500' : getBurnoutRiskColor(staff.burnoutRisk).includes('orange') ? 'border-l-orange-500' : getBurnoutRiskColor(staff.burnoutRisk).includes('yellow') ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{staff.name}</h3>
                      <p className="text-sm text-gray-600">{staff.department} • {staff.experienceYears} years experience</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg text-sm font-medium ${getBurnoutRiskColor(staff.burnoutRisk)}`}>
                    <div className="text-center">
                      <div className="text-lg font-bold">{staff.burnoutScore}</div>
                      <div className="text-xs uppercase">{staff.burnoutRisk} Risk</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Work Load Analysis */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>Workload Analysis</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>This Week:</span>
                        <span className={staff.hoursWorked.thisWeek > 40 ? 'font-medium text-red-600' : 'text-gray-900'}>
                          {staff.hoursWorked.thisWeek}h
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Week:</span>
                        <span className={staff.hoursWorked.lastWeek > 40 ? 'font-medium text-red-600' : 'text-gray-900'}>
                          {staff.hoursWorked.lastWeek}h
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overtime:</span>
                        <span className={staff.hoursWorked.overtime > 0 ? 'font-medium text-orange-600' : 'text-gray-900'}>
                          {staff.hoursWorked.overtime}h
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Patient Load:</span>
                        <span>{staff.patientCapacity} patients</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance & Skills */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                      <Award className="h-4 w-4 text-green-600" />
                      <span>Performance & Skills</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Performance Score:</span>
                        <span className="font-medium text-green-600">{staff.performanceScore}%</span>
                      </div>
                      <div>
                        <span>Certifications:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {staff.certifications.map((cert, idx) => (
                            <span key={idx} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span>Training Needs:</span>
                        <div className="mt-1">
                          {staff.trainingNeeds.length > 0 ? (
                            staff.trainingNeeds.map((need, idx) => (
                              <div key={idx} className="text-xs text-orange-600">{need}</div>
                            ))
                          ) : (
                            <span className="text-xs text-green-600">Up to date</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Burnout Prevention Actions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      <span>Prevention Actions</span>
                    </h4>
                    <div className="space-y-2">
                      {staff.burnoutRisk === 'critical' && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                          <div className="font-medium text-red-700 mb-1">Immediate Actions Required:</div>
                          <ul className="text-red-600 space-y-1">
                            <li>• Schedule mandatory rest period</li>
                            <li>• Reduce patient load</li>
                            <li>• Provide counseling support</li>
                          </ul>
                        </div>
                      )}
                      {staff.burnoutRisk === 'high' && (
                        <div className="p-2 bg-orange-50 border border-orange-200 rounded text-xs">
                          <div className="font-medium text-orange-700 mb-1">Preventive Measures:</div>
                          <ul className="text-orange-600 space-y-1">
                            <li>• Monitor schedule closely</li>
                            <li>• Ensure adequate breaks</li>
                            <li>• Consider wellness program</li>
                          </ul>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => showInfo('Schedule Adjustment', `Opening schedule management for ${staff.name}`)}
                        >
                          Adjust Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Gap Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span>Skill Gap Analysis</span>
              </CardTitle>
              <CardDescription>
                Identified training needs and competency gaps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillGaps.map(gap => (
                <div key={gap.id} className={`border rounded-lg p-4 ${getPriorityColor(gap.priority)}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{gap.skillName}</h4>
                      <p className="text-sm text-gray-600">{gap.department}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(gap.priority)}`}>
                      {gap.priority} Priority
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-gray-600">Required Level:</p>
                      <div className="flex space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map(level => (
                          <div
                            key={level}
                            className={`w-4 h-4 rounded ${
                              level <= gap.requiredLevel ? 'bg-blue-500' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Current Level:</p>
                      <div className="flex space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map(level => (
                          <div
                            key={level}
                            className={`w-4 h-4 rounded ${
                              level <= gap.currentLevel ? 'bg-orange-500' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-1 mb-3">
                    <p><strong>Staff Affected:</strong> {gap.staffAffected} team members</p>
                    <p><strong>Training Plan:</strong> {gap.trainingPlan}</p>
                    <p><strong>Estimated Cost:</strong> ${gap.estimatedCost.toLocaleString()}</p>
                    <p><strong>Target Date:</strong> {gap.completionTarget.toLocaleDateString()}</p>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => showAlert({
                      type: 'info',
                      title: 'Training Program Details',
                      message: `Training Program: ${gap.trainingPlan}\n\nDepartment: ${gap.department}\nStaff Affected: ${gap.staffAffected}\nCost: $${gap.estimatedCost.toLocaleString()}\nTarget Completion: ${gap.completionTarget.toLocaleDateString()}\n\nWould you like to initiate this training program?`
                    })}
                  >
                    View Training Plan
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Cross-Training Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>Cross-Training Matrix</span>
              </CardTitle>
              <CardDescription>
                Staff competencies and cross-training opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffMembers.map(staff => (
                  <div key={staff.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{staff.name}</h4>
                      <span className="text-sm text-gray-600">{staff.department}</span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Current Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {staff.skills.map((skill, idx) => (
                          <span key={idx} className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Cross-Training Opportunities:</p>
                      <div className="space-y-1">
                        {staff.department === 'ICU' && (
                          <div className="text-xs text-blue-600">→ Emergency Department (Trauma Care)</div>
                        )}
                        {staff.department === 'Emergency' && (
                          <div className="text-xs text-blue-600">→ ICU (Critical Care)</div>
                        )}
                        {staff.role === 'LPN' && (
                          <div className="text-xs text-purple-600">→ RN Bridge Program Available</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workforce Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Workforce Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">32%</div>
                    <div className="text-sm text-blue-700">Burnout Reduction</div>
                    <div className="text-xs text-blue-500">vs. last quarter</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">18%</div>
                    <div className="text-sm text-green-700">Turnover Reduction</div>
                    <div className="text-xs text-green-500">YTD improvement</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">94%</div>
                    <div className="text-sm text-purple-700">Schedule Compliance</div>
                    <div className="text-xs text-purple-500">AI recommendations</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">$245K</div>
                    <div className="text-sm text-orange-700">Cost Savings</div>
                    <div className="text-xs text-orange-500">Reduced overtime</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span>ROI Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">AI Workforce Management Benefits:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Reduced Agency Staffing:</span>
                      <span className="font-medium text-green-600">+$180K/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Decreased Turnover:</span>
                      <span className="font-medium text-green-600">+$65K/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime Optimization:</span>
                      <span className="font-medium text-green-600">+$95K/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Improved Patient Ratios:</span>
                      <span className="font-medium text-green-600">+$120K/month</span>
                    </div>
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">$460K</div>
                  <div className="text-sm text-green-700">Total Monthly Savings</div>
                  <div className="text-xs text-green-500">$5.5M annualized ROI</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
