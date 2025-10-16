'use client';

import React from 'react';
import { 
  Bed, 
  AlertTriangle, 
  Users, 
  Clock, 
  Activity,
  TrendingUp,
  Ambulance
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Patient Flow Widget Props
export interface PatientFlowWidgetProps {
  className?: string;
}

// Mock data for preview
const mockPatientFlowData = {
  bedOccupancy: 89,
  availableBeds: 35,
  edWaitTime: 125, // minutes
  criticalBottlenecks: 2,
  predictedDischarges: 28,
  orUtilization: 88,
  flowEfficiency: 76,
  monthlyROI: 1020000 // $1.02M
};

const criticalAlerts = [
  {
    id: '1',
    type: 'bed_shortage',
    severity: 'critical',
    message: '12 patients boarding in ED - no available beds',
    location: 'Emergency Department',
    impact: 'High'
  },
  {
    id: '2',
    type: 'equipment',
    severity: 'high',
    message: 'OR-3 surgical robot malfunction causing delays',
    location: 'Operating Suite',
    impact: 'Medium'
  },
  {
    id: '3',
    type: 'discharge_delay',
    severity: 'medium',
    message: '8 patients ready for discharge awaiting transport',
    location: 'Medical Floor',
    impact: 'Medium'
  }
];

export function PatientFlowWidget({ className }: PatientFlowWidgetProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'bed_shortage': return <Bed className="h-4 w-4" />;
      case 'equipment': return <Activity className="h-4 w-4" />;
      case 'discharge_delay': return <Users className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bed className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Patient Flow & Beds</h3>
              <p className="text-sm text-gray-500">AI-Powered Flow Optimization</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${(mockPatientFlowData.monthlyROI / 1000000).toFixed(2)}M
            </div>
            <div className="text-xs text-green-500">Monthly ROI</div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-3 rounded-lg border ${
            mockPatientFlowData.bedOccupancy > 85 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  mockPatientFlowData.bedOccupancy > 85 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  Bed Occupancy
                </p>
                <p className={`text-xl font-bold ${
                  mockPatientFlowData.bedOccupancy > 85 ? 'text-orange-700' : 'text-green-700'
                }`}>
                  {mockPatientFlowData.bedOccupancy}%
                </p>
              </div>
              <Bed className={`h-6 w-6 ${
                mockPatientFlowData.bedOccupancy > 85 ? 'text-orange-600' : 'text-green-600'
              }`} />
            </div>
            <p className={`text-xs ${
              mockPatientFlowData.bedOccupancy > 85 ? 'text-orange-500' : 'text-green-500'
            }`}>
              {mockPatientFlowData.availableBeds} available
            </p>
          </div>

          <div className={`p-3 rounded-lg border ${
            mockPatientFlowData.edWaitTime > 120 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  mockPatientFlowData.edWaitTime > 120 ? 'text-red-600' : 'text-blue-600'
                }`}>
                  ED Wait Time
                </p>
                <p className={`text-xl font-bold ${
                  mockPatientFlowData.edWaitTime > 120 ? 'text-red-700' : 'text-blue-700'
                }`}>
                  {Math.round(mockPatientFlowData.edWaitTime / 60)}h{mockPatientFlowData.edWaitTime % 60}m
                </p>
              </div>
              <Ambulance className={`h-6 w-6 ${
                mockPatientFlowData.edWaitTime > 120 ? 'text-red-600' : 'text-blue-600'
              }`} />
            </div>
            <p className={`text-xs ${
              mockPatientFlowData.edWaitTime > 120 ? 'text-red-500' : 'text-blue-500'
            }`}>
              42 patients in ED
            </p>
          </div>

          <div className="p-3 rounded-lg border bg-purple-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">OR Utilization</p>
                <p className="text-xl font-bold text-purple-700">{mockPatientFlowData.orUtilization}%</p>
              </div>
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-xs text-purple-500">12 cases scheduled</p>
          </div>

          <div className="p-3 rounded-lg border bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Flow Efficiency</p>
                <p className="text-xl font-bold text-green-700">{mockPatientFlowData.flowEfficiency}%</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xs text-green-500">{mockPatientFlowData.predictedDischarges} discharges today</p>
          </div>
        </div>

        {/* Critical Flow Bottlenecks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Critical Flow Bottlenecks</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              mockPatientFlowData.criticalBottlenecks > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {mockPatientFlowData.criticalBottlenecks} Active
            </span>
          </div>
          <div className="space-y-2">
            {criticalAlerts.slice(0, 3).map(alert => (
              <div key={alert.id} className={`flex items-start space-x-3 p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                <div className="mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{alert.location}</p>
                    <span className="text-xs px-2 py-1 bg-white bg-opacity-60 rounded-full">
                      {alert.impact} Impact
                    </span>
                  </div>
                  <p className="text-xs mt-1 line-clamp-2">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                <strong className="text-blue-600">{mockPatientFlowData.predictedDischarges}</strong> predicted discharges
              </span>
              <span className="text-gray-600">
                <strong className="text-green-600">76%</strong> flow efficiency
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}