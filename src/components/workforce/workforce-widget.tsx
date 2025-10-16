'use client';

import React from 'react';
import { Users, Clock, AlertTriangle, TrendingUp, Brain, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WorkforceWidgetProps {
  className?: string;
  onViewDetails?: () => void;
}

interface WorkforceMetric {
  id: string;
  type: 'burnout_alert' | 'staffing_shortage' | 'schedule_optimization' | 'skill_gap';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  department: string;
  timeframe: string;
  actionRequired: boolean;
}

const mockWorkforceMetrics: WorkforceMetric[] = [
  {
    id: '1',
    type: 'burnout_alert',
    severity: 'critical',
    title: 'Critical Burnout Risk',
    description: 'Emily Rodriguez - 54 hours this week, immediate intervention needed',
    department: 'Med-Surg',
    timeframe: '30 min ago',
    actionRequired: true
  },
  {
    id: '2',
    type: 'staffing_shortage',
    severity: 'high',
    title: 'ICU Staffing Shortage',
    description: '3 RN positions needed for optimal patient ratios',
    department: 'ICU',
    timeframe: '2 hours',
    actionRequired: true
  },
  {
    id: '3',
    type: 'schedule_optimization',
    severity: 'medium',
    title: 'AI Schedule Recommendation',
    description: 'Optimize night shift coverage - 92% confidence improvement',
    department: 'Emergency',
    timeframe: 'Next 24h',
    actionRequired: false
  },
  {
    id: '4',
    type: 'skill_gap',
    severity: 'medium',
    title: 'ECMO Training Gap',
    description: '8 ICU staff need ECMO certification for compliance',
    department: 'ICU',
    timeframe: '60 days',
    actionRequired: false
  }
];

export function WorkforceWidget({ className, onViewDetails }: WorkforceWidgetProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string, severity: string) => {
    const iconClass = `h-4 w-4 ${
      severity === 'critical' ? 'text-red-600' : 
      severity === 'high' ? 'text-orange-600' : 
      severity === 'medium' ? 'text-yellow-600' : 
      'text-green-600'
    }`;

    switch (type) {
      case 'burnout_alert': return <AlertTriangle className={iconClass} />;
      case 'staffing_shortage': return <Users className={iconClass} />;
      case 'schedule_optimization': return <Calendar className={iconClass} />;
      case 'skill_gap': return <Brain className={iconClass} />;
      default: return <Clock className={iconClass} />;
    }
  };

  const criticalAlerts = mockWorkforceMetrics.filter(m => m.severity === 'critical').length;
  const highPriorityItems = mockWorkforceMetrics.filter(m => m.severity === 'high' || m.severity === 'critical').length;
  const actionRequiredItems = mockWorkforceMetrics.filter(m => m.actionRequired).length;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Workforce Management</CardTitle>
          </div>
          {criticalAlerts > 0 && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              <AlertTriangle className="h-3 w-3" />
              <span>{criticalAlerts} Critical</span>
            </div>
          )}
        </div>
        <CardDescription>
          AI-powered staffing optimization and burnout prevention
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-lg font-bold text-red-600">{actionRequiredItems}</div>
            <div className="text-xs text-red-600">Action Required</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-lg font-bold text-orange-600">{highPriorityItems}</div>
            <div className="text-xs text-orange-600">High Priority</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-600">94%</div>
            <div className="text-xs text-green-600">AI Accuracy</div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-1">
            <Brain className="h-4 w-4 text-purple-600" />
            <span>AI Workforce Insights</span>
          </h4>
          
          {mockWorkforceMetrics.slice(0, 3).map(metric => (
            <div key={metric.id} className={`p-3 rounded-lg border ${getSeverityColor(metric.severity)}`}>
              <div className="flex items-start space-x-2">
                {getTypeIcon(metric.type, metric.severity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium truncate">{metric.title}</h5>
                    <span className="text-xs ml-2 whitespace-nowrap">{metric.timeframe}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{metric.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{metric.department}</span>
                    {metric.actionRequired && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        Action Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Predictive Insights */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Next 24 Hours Prediction:</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">High Confidence</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <div>• ICU census: 24 patients (↑2 from current)</div>
            <div>• Emergency acuity: 3.8/5 (elevated evening shift)</div>
            <div>• Staff burnout risk: 2 critical, 3 high</div>
            <div>• Recommended adjustments: 4 schedule changes</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onViewDetails}
          >
            <Users className="h-4 w-4 mr-2" />
            View Workforce Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}