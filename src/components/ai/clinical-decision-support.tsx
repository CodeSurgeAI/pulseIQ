'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Heart, 
  Brain, 
  Shield, 
  TrendingUp, 
  Clock, 
  User, 
  Activity,
  Zap,
  FileText,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';

// Types for CDSS
export interface PatientRiskScore {
  patientId: string;
  patientName: string;
  roomNumber: string;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  predictions: {
    sepsis: {
      probability: number;
      timeToOnset: number; // hours
      keyIndicators: string[];
    };
    deterioration: {
      probability: number;
      timeToEvent: number; // hours
      vitalTrends: string[];
    };
  };
  vitals: {
    temperature: number;
    heartRate: number;
    bloodPressure: string;
    respiratoryRate: number;
    oxygenSaturation: number;
    lastUpdated: Date;
  };
  medications: string[];
  alerts: ClinicalAlert[];
}

export interface ClinicalAlert {
  id: string;
  type: 'sepsis' | 'drug_interaction' | 'deterioration' | 'pathway' | 'critical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  recommendations: string[];
  timestamp: Date;
  acknowledged: boolean;
  patientId?: string;
}

export interface DrugInteraction {
  id: string;
  drugA: string;
  drugB: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  interaction: string;
  recommendation: string;
  patientId: string;
}

export interface ClinicalPathway {
  id: string;
  condition: string;
  patientId: string;
  currentStep: number;
  totalSteps: number;
  nextRecommendations: string[];
  estimatedCompletion: Date;
  adherenceScore: number;
}

// Mock data
const mockPatientRisks: PatientRiskScore[] = [
  {
    patientId: '1',
    patientName: 'Maria Rodriguez',
    roomNumber: 'ICU-204',
    overallRisk: 'critical',
    riskScore: 89,
    predictions: {
      sepsis: {
        probability: 0.78,
        timeToOnset: 4.5,
        keyIndicators: ['Elevated WBC', 'Temperature trend', 'Lactate levels']
      },
      deterioration: {
        probability: 0.82,
        timeToEvent: 6.2,
        vitalTrends: ['Declining BP', 'Increasing HR', 'Respiratory distress']
      }
    },
    vitals: {
      temperature: 102.1,
      heartRate: 118,
      bloodPressure: '88/54',
      respiratoryRate: 24,
      oxygenSaturation: 89,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 5)
    },
    medications: ['Vancomycin', 'Norepinephrine', 'Furosemide'],
    alerts: []
  },
  {
    patientId: '2',
    patientName: 'James Thompson',
    roomNumber: 'Med-315',
    overallRisk: 'high',
    riskScore: 73,
    predictions: {
      sepsis: {
        probability: 0.45,
        timeToOnset: 8.1,
        keyIndicators: ['Mild leukocytosis', 'Procalcitonin elevation']
      },
      deterioration: {
        probability: 0.62,
        timeToEvent: 11.3,
        vitalTrends: ['Gradual BP decline', 'Intermittent tachycardia']
      }
    },
    vitals: {
      temperature: 100.8,
      heartRate: 95,
      bloodPressure: '110/68',
      respiratoryRate: 18,
      oxygenSaturation: 94,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 3)
    },
    medications: ['Lisinopril', 'Metformin', 'Aspirin'],
    alerts: []
  },
  {
    patientId: '3',
    patientName: 'Sarah Chen',
    roomNumber: 'Surg-122',
    overallRisk: 'medium',
    riskScore: 42,
    predictions: {
      sepsis: {
        probability: 0.15,
        timeToOnset: 24.0,
        keyIndicators: ['Post-operative monitoring', 'Normal inflammatory markers']
      },
      deterioration: {
        probability: 0.28,
        timeToEvent: 18.5,
        vitalTrends: ['Stable vitals', 'Post-op recovery']
      }
    },
    vitals: {
      temperature: 98.9,
      heartRate: 78,
      bloodPressure: '125/82',
      respiratoryRate: 16,
      oxygenSaturation: 98,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 2)
    },
    medications: ['Morphine', 'Ondansetron', 'Cefazolin'],
    alerts: []
  }
];

const mockClinicalAlerts: ClinicalAlert[] = [
  {
    id: '1',
    type: 'sepsis',
    severity: 'critical',
    title: 'High Sepsis Risk Detected',
    message: 'Patient Maria Rodriguez (ICU-204) shows 78% probability of sepsis onset within 4.5 hours',
    recommendations: [
      'Initiate early sepsis bundle',
      'Order blood cultures stat',
      'Consider empirical antibiotics',
      'Increase monitoring frequency'
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    acknowledged: false,
    patientId: '1'
  },
  {
    id: '2',
    type: 'drug_interaction',
    severity: 'high',
    title: 'Major Drug Interaction Warning',
    message: 'Warfarin + Aspirin combination detected for patient in Room 315',
    recommendations: [
      'Monitor INR closely',
      'Consider alternative antiplatelet',
      'Assess bleeding risk',
      'Patient education on bleeding signs'
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    acknowledged: false,
    patientId: '2'
  },
  {
    id: '3',
    type: 'deterioration',
    severity: 'medium',
    title: 'Patient Deterioration Risk',
    message: 'Gradual decline in vital signs detected for James Thompson',
    recommendations: [
      'Increase vital sign monitoring',
      'Consider early warning score calculation',
      'Notify attending physician',
      'Prepare for potential intervention'
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    acknowledged: true,
    patientId: '2'
  }
];

const mockDrugInteractions: DrugInteraction[] = [
  {
    id: '1',
    drugA: 'Warfarin',
    drugB: 'Aspirin',
    severity: 'major',
    interaction: 'Increased bleeding risk due to anticoagulant and antiplatelet combination',
    recommendation: 'Monitor INR closely, consider gastroprotection, patient education',
    patientId: '2'
  },
  {
    id: '2',
    drugA: 'Lisinopril',
    drugB: 'Potassium Supplement',
    severity: 'moderate',
    interaction: 'Risk of hyperkalemia with ACE inhibitor and potassium',
    recommendation: 'Monitor serum potassium levels, adjust doses if needed',
    patientId: '2'
  }
];

const mockClinicalPathways: ClinicalPathway[] = [
  {
    id: '1',
    condition: 'Pneumonia Care Bundle',
    patientId: '1',
    currentStep: 3,
    totalSteps: 8,
    nextRecommendations: [
      'Blood cultures within 1 hour',
      'Antibiotics within 3 hours',
      'Lactate measurement'
    ],
    estimatedCompletion: new Date(Date.now() + 1000 * 60 * 60 * 24),
    adherenceScore: 87
  },
  {
    id: '2',
    condition: 'Heart Failure Management',
    patientId: '2',
    currentStep: 5,
    totalSteps: 10,
    nextRecommendations: [
      'Daily weight monitoring',
      'ACE inhibitor optimization',
      'Patient education on fluid restriction'
    ],
    estimatedCompletion: new Date(Date.now() + 1000 * 60 * 60 * 72),
    adherenceScore: 94
  }
];

interface ClinicalDecisionSupportProps {
  className?: string;
}

export function ClinicalDecisionSupport({ className }: ClinicalDecisionSupportProps) {
  const { showAlert } = useAlert();
  const { showSuccess, showInfo, showWarning, showError } = useToast();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'patients' | 'alerts' | 'pathways'>('overview');
  const [patients, setPatients] = useState<PatientRiskScore[]>(mockPatientRisks);
  const [alerts, setAlerts] = useState<ClinicalAlert[]>(mockClinicalAlerts);
  const [drugInteractions] = useState<DrugInteraction[]>(mockDrugInteractions);
  const [pathways] = useState<ClinicalPathway[]>(mockClinicalPathways);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    showInfo('Refreshing', 'Updating AI predictions and patient risk scores...');
    
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      showSuccess('Data Updated', 'AI predictions and risk scores have been refreshed');
    }, 2000);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    showSuccess('Alert Acknowledged', 'Alert has been marked as reviewed');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'major': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'minor': return 'text-green-600 bg-green-50 border-green-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged);
  const highRiskPatients = patients.filter(p => p.overallRisk === 'critical' || p.overallRisk === 'high');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clinical Decision Support</h1>
            <p className="text-sm text-gray-500">AI-Powered Real-time Clinical Intelligence</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleRefreshData}
          disabled={isRefreshing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh AI Data</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-700">{criticalAlerts.length}</p>
                <p className="text-xs text-red-500">Require immediate attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">High Risk Patients</p>
                <p className="text-2xl font-bold text-orange-700">{highRiskPatients.length}</p>
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
                <p className="text-sm font-medium text-yellow-600">Drug Interactions</p>
                <p className="text-2xl font-bold text-yellow-700">{drugInteractions.length}</p>
                <p className="text-xs text-yellow-500">Active warnings</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Pathways</p>
                <p className="text-2xl font-bold text-green-700">{pathways.length}</p>
                <p className="text-xs text-green-500">Clinical protocols running</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'patients', label: 'Patient Risk Scores', icon: User },
            { id: 'alerts', label: 'Clinical Alerts', icon: AlertTriangle },
            { id: 'pathways', label: 'Care Pathways', icon: FileText }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as 'overview' | 'patients' | 'alerts' | 'pathways')}
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
          {/* Critical Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Critical Alerts</span>
              </CardTitle>
              <CardDescription>
                Immediate action required - AI predictions with high confidence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {criticalAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900">{alert.title}</h4>
                      <p className="text-sm text-red-700 mt-1">{alert.message}</p>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-red-600 mb-1">Recommendations:</p>
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
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                      className="ml-3"
                    >
                      Acknowledge
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* High Risk Patients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span>High Risk Patients</span>
              </CardTitle>
              <CardDescription>
                Patients with elevated risk scores requiring close monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {highRiskPatients.slice(0, 3).map(patient => (
                <div key={patient.patientId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{patient.patientName}</h4>
                      <p className="text-sm text-gray-600">Room {patient.roomNumber}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(patient.overallRisk)}`}>
                      Risk: {patient.riskScore}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Sepsis Risk:</p>
                      <p className="font-medium text-red-600">
                        {Math.round(patient.predictions.sepsis.probability * 100)}% in {patient.predictions.sepsis.timeToOnset}h
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Deterioration:</p>
                      <p className="font-medium text-orange-600">
                        {Math.round(patient.predictions.deterioration.probability * 100)}% in {patient.predictions.deterioration.timeToEvent}h
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'patients' && (
        <div className="space-y-4">
          {patients.map(patient => (
            <Card key={patient.patientId} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{patient.patientName}</h3>
                      <p className="text-sm text-gray-600">Room {patient.roomNumber}</p>
                      <p className="text-xs text-gray-500">
                        Last updated: {patient.vitals.lastUpdated.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg text-sm font-medium ${getRiskColor(patient.overallRisk)}`}>
                    <div className="text-center">
                      <div className="text-lg font-bold">{patient.riskScore}</div>
                      <div className="text-xs uppercase">{patient.overallRisk} Risk</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* AI Predictions */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span>AI Predictions</span>
                    </h4>
                    
                    <div className="border border-red-200 bg-red-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-red-600">Sepsis Risk</span>
                        <span className="text-lg font-bold text-red-700">
                          {Math.round(patient.predictions.sepsis.probability * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-red-600 mb-2">
                        Predicted onset: {patient.predictions.sepsis.timeToOnset} hours
                      </p>
                      <div className="space-y-1">
                        {patient.predictions.sepsis.keyIndicators.map((indicator, idx) => (
                          <div key={idx} className="text-xs text-red-600 flex items-center space-x-1">
                            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                            <span>{indicator}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-orange-200 bg-orange-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-orange-600">Deterioration Risk</span>
                        <span className="text-lg font-bold text-orange-700">
                          {Math.round(patient.predictions.deterioration.probability * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-orange-600 mb-2">
                        Predicted event: {patient.predictions.deterioration.timeToEvent} hours
                      </p>
                      <div className="space-y-1">
                        {patient.predictions.deterioration.vitalTrends.map((trend, idx) => (
                          <div key={idx} className="text-xs text-orange-600 flex items-center space-x-1">
                            <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                            <span>{trend}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Current Vitals */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-green-600" />
                      <span>Current Vitals</span>
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Temperature</span>
                        <span className={`font-medium ${patient.vitals.temperature > 100 ? 'text-red-600' : 'text-gray-900'}`}>
                          {patient.vitals.temperature}°F
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Heart Rate</span>
                        <span className={`font-medium ${patient.vitals.heartRate > 100 ? 'text-orange-600' : 'text-gray-900'}`}>
                          {patient.vitals.heartRate} bpm
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Blood Pressure</span>
                        <span className="font-medium text-gray-900">{patient.vitals.bloodPressure}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Respiratory Rate</span>
                        <span className={`font-medium ${patient.vitals.respiratoryRate > 20 ? 'text-orange-600' : 'text-gray-900'}`}>
                          {patient.vitals.respiratoryRate} /min
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">O2 Saturation</span>
                        <span className={`font-medium ${patient.vitals.oxygenSaturation < 95 ? 'text-red-600' : 'text-gray-900'}`}>
                          {patient.vitals.oxygenSaturation}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Current Medications */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      <span>Current Medications</span>
                    </h4>
                    
                    <div className="space-y-2">
                      {patient.medications.map((medication, idx) => (
                        <div key={idx} className="flex items-center space-x-2 py-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-sm text-gray-700">{medication}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Check for drug interactions for this patient */}
                    {drugInteractions.filter(interaction => interaction.patientId === patient.patientId).length > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-700">Drug Interaction Warning</span>
                        </div>
                        {drugInteractions
                          .filter(interaction => interaction.patientId === patient.patientId)
                          .map(interaction => (
                            <div key={interaction.id} className="text-xs text-yellow-700 mb-1">
                              <span className="font-medium">{interaction.drugA} + {interaction.drugB}</span>
                              <span className="block">{interaction.interaction}</span>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showInfo('Patient Details', `Opening detailed chart for ${patient.patientName}`)}
                    >
                      View Full Chart
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => showAlert({
                        type: 'info',
                        title: 'Clinical Interventions',
                        message: `Recommended interventions for ${patient.patientName}:\n\n• Increase monitoring frequency\n• Consider early intervention protocols\n• Alert attending physician\n• Review medication dosages`
                      })}
                    >
                      View Recommendations
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.map(alert => (
            <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity).includes('red') ? 'border-l-red-500' : getSeverityColor(alert.severity).includes('orange') ? 'border-l-orange-500' : getSeverityColor(alert.severity).includes('yellow') ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                        {alert.type === 'sepsis' && <Heart className="h-4 w-4" />}
                        {alert.type === 'drug_interaction' && <Shield className="h-4 w-4" />}
                        {alert.type === 'deterioration' && <TrendingUp className="h-4 w-4" />}
                        {alert.type === 'pathway' && <FileText className="h-4 w-4" />}
                        {alert.type === 'critical' && <AlertTriangle className="h-4 w-4" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{alert.timestamp.toLocaleString()}</span>
                          </div>
                          {alert.acknowledged && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              <span>Acknowledged</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{alert.message}</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Recommended Actions:</h4>
                      <ul className="space-y-1">
                        {alert.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col space-y-2">
                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => {
                        if (alert.patientId) {
                          showInfo('Opening Chart', `Navigating to patient chart for detailed review`);
                        }
                      }}
                    >
                      View Patient
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === 'pathways' && (
        <div className="space-y-4">
          {pathways.map(pathway => (
            <Card key={pathway.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{pathway.condition}</h3>
                    <p className="text-sm text-gray-600">
                      Patient ID: {pathway.patientId} • Step {pathway.currentStep} of {pathway.totalSteps}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      pathway.adherenceScore >= 90 ? 'bg-green-100 text-green-700' :
                      pathway.adherenceScore >= 75 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {pathway.adherenceScore}% Adherence
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round((pathway.currentStep / pathway.totalSteps) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(pathway.currentStep / pathway.totalSteps) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium text-gray-900">Next Recommended Actions:</h4>
                  <ul className="space-y-1">
                    {pathway.nextRecommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Estimated completion: {pathway.estimatedCompletion.toLocaleDateString()}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => showInfo('Pathway Details', `Opening detailed pathway view for ${pathway.condition}`)}
                  >
                    View Full Pathway
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}