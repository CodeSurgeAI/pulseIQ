'use client';

import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Shield,
  Calculator,
  Activity
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Financial Performance Widget Props
export interface FinancialPerformanceWidgetProps {
  className?: string;
}

// Mock data for preview
const mockFinancialData = {
  monthlyROI: 1850000, // $1.85M
  operatingMargin: 8.2,
  denialRate: 3.8,
  daysInAR: 42,
  valueBasedRevenue: 28500000,
  atRiskContracts: 1,
  highRiskClaims: 2,
  lossLeadingDRGs: 1
};

const criticalFinancialAlerts = [
  {
    id: '1',
    type: 'contract_risk',
    severity: 'high',
    message: 'Blue Cross Bundled Payment at risk - $75K penalty exposure',
    location: 'Value-Based Care',
    impact: 'High',
    amount: 75000
  },
  {
    id: '2',
    type: 'denial_risk',
    severity: 'critical',
    message: 'High denial risk claim - $25.6K Medicare submission',
    location: 'Revenue Cycle',
    impact: 'Medium',
    amount: 25600
  },
  {
    id: '3',
    type: 'cost_variance',
    severity: 'high',
    message: 'Heart Failure DRG showing -12.5% margin',
    location: 'Cost Management',
    impact: 'High',
    amount: 1600
  }
];

export function FinancialPerformanceWidget({ className }: FinancialPerformanceWidgetProps) {
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
      case 'contract_risk': return <Target className="h-4 w-4" />;
      case 'denial_risk': return <Shield className="h-4 w-4" />;
      case 'cost_variance': return <Calculator className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Financial Performance</h3>
              <p className="text-sm text-gray-500">Revenue Optimization & VBC Analytics</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${(mockFinancialData.monthlyROI / 1000000).toFixed(2)}M
            </div>
            <div className="text-xs text-green-500">Monthly ROI</div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-lg border bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Operating Margin</p>
                <p className="text-xl font-bold text-green-700">{mockFinancialData.operatingMargin}%</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xs text-green-500">Above industry avg</p>
          </div>

          <div className={`p-3 rounded-lg border ${
            mockFinancialData.denialRate > 5 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  mockFinancialData.denialRate > 5 ? 'text-red-600' : 'text-blue-600'
                }`}>
                  Denial Rate
                </p>
                <p className={`text-xl font-bold ${
                  mockFinancialData.denialRate > 5 ? 'text-red-700' : 'text-blue-700'
                }`}>
                  {mockFinancialData.denialRate}%
                </p>
              </div>
              <Shield className={`h-6 w-6 ${
                mockFinancialData.denialRate > 5 ? 'text-red-600' : 'text-blue-600'
              }`} />
            </div>
            <p className={`text-xs ${
              mockFinancialData.denialRate > 5 ? 'text-red-500' : 'text-blue-500'
            }`}>
              {mockFinancialData.highRiskClaims} high-risk claims
            </p>
          </div>

          <div className="p-3 rounded-lg border bg-purple-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">VBC Revenue</p>
                <p className="text-xl font-bold text-purple-700">
                  ${(mockFinancialData.valueBasedRevenue / 1000000).toFixed(1)}M
                </p>
              </div>
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-xs text-purple-500">{mockFinancialData.atRiskContracts} contract at risk</p>
          </div>

          <div className="p-3 rounded-lg border bg-orange-50 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Days in A/R</p>
                <p className="text-xl font-bold text-orange-700">{mockFinancialData.daysInAR}</p>
              </div>
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-xs text-orange-500">Target: &lt;40 days</p>
          </div>
        </div>

        {/* Critical Financial Alerts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Critical Financial Risks</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              criticalFinancialAlerts.length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {criticalFinancialAlerts.length} Active
            </span>
          </div>
          <div className="space-y-2">
            {criticalFinancialAlerts.slice(0, 3).map(alert => (
              <div key={alert.id} className={`flex items-start space-x-3 p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                <div className="mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{alert.location}</p>
                    <span className="text-xs px-2 py-1 bg-white bg-opacity-60 rounded-full">
                      ${(alert.amount / 1000).toFixed(0)}K
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
                <strong className="text-green-600">${(mockFinancialData.valueBasedRevenue / 1000000).toFixed(1)}M</strong> VBC revenue
              </span>
              <span className="text-gray-600">
                <strong className="text-blue-600">{mockFinancialData.operatingMargin}%</strong> margin
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