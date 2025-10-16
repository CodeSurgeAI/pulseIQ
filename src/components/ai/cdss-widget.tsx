'use client';

import React from 'react';
import { Brain, AlertTriangle, TrendingUp, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CDSSWidgetProps {
  userRole?: string;
  onOpenFullCDSS?: () => void;
  className?: string;
}

export function CDSSWidget({ userRole = 'admin', onOpenFullCDSS, className }: CDSSWidgetProps) {
  const criticalAlerts = [
    {
      type: 'sepsis',
      patient: 'Maria Rodriguez (ICU-204)',
      risk: 78,
      timeWindow: '4.5h',
      severity: 'critical'
    },
    {
      type: 'deterioration',
      patient: 'James Thompson (Med-315)',
      risk: 62,
      timeWindow: '11.3h',
      severity: 'high'
    },
    {
      type: 'drug_interaction',
      patient: 'Room 315',
      risk: 85,
      timeWindow: 'Now',
      severity: 'high'
    }
  ];

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
      case 'sepsis': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'deterioration': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case 'drug_interaction': return <Shield className="h-4 w-4 text-yellow-600" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span className="text-lg">AI Clinical Alerts</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenFullCDSS}
          >
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {criticalAlerts.slice(0, 3).map((alert, index) => (
          <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {alert.type === 'sepsis' && 'Sepsis Risk'}
                    {alert.type === 'deterioration' && 'Patient Deterioration'}
                    {alert.type === 'drug_interaction' && 'Drug Interaction'}
                  </p>
                  <p className="text-xs opacity-90 truncate">{alert.patient}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs font-medium">{alert.risk}% risk</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{alert.timeWindow}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                {alert.severity}
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">AI Predictions Updated:</span>
            <span className="font-medium text-gray-900">2 min ago</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Next Scan:</span>
            <span className="font-medium text-blue-600">In 3 min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}