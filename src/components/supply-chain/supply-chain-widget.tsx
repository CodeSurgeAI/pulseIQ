'use client';

import React from 'react';
import { Package, TruckIcon, AlertTriangle, DollarSign, Brain, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SupplyChainWidgetProps {
  className?: string;
  onViewDetails?: () => void;
}

interface SupplyAlert {
  id: string;
  type: 'stockout_risk' | 'vendor_issue' | 'cost_opportunity' | 'delivery_delay';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  item: string;
  timeframe: string;
  actionRequired: boolean;
  costImpact: number;
}

const mockSupplyAlerts: SupplyAlert[] = [
  {
    id: '1',
    type: 'stockout_risk',
    severity: 'critical',
    title: 'N95 Masks Critical',
    description: 'Only 4 days supply remaining, extended lead times detected',
    item: 'N95 Respirator Masks',
    timeframe: '4 days',
    actionRequired: true,
    costImpact: 125000
  },
  {
    id: '2',
    type: 'stockout_risk',
    severity: 'critical',
    title: 'Propofol Shortage',
    description: 'Below safety stock, surgical procedures may be affected',
    item: 'Propofol 10mg/ml',
    timeframe: '4 days',
    actionRequired: true,
    costImpact: 75000
  },
  {
    id: '3',
    type: 'vendor_issue',
    severity: 'high',
    title: 'Vendor Risk Alert',
    description: 'PharmaCorp reliability score dropped to 78% - diversification needed',
    item: 'Pharmaceutical Supplies',
    timeframe: 'Ongoing',
    actionRequired: false,
    costImpact: 45000
  },
  {
    id: '4',
    type: 'cost_opportunity',
    severity: 'medium',
    title: 'Cost Optimization',
    description: 'AI identified $145K monthly savings opportunity across vendors',
    item: 'Multiple Categories',
    timeframe: 'Next 30 days',
    actionRequired: false,
    costImpact: -145000
  }
];

export function SupplyChainWidget({ className, onViewDetails }: SupplyChainWidgetProps) {
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
      case 'stockout_risk': return <AlertTriangle className={iconClass} />;
      case 'vendor_issue': return <TruckIcon className={iconClass} />;
      case 'cost_opportunity': return <DollarSign className={iconClass} />;
      case 'delivery_delay': return <Package className={iconClass} />;
      default: return <Package className={iconClass} />;
    }
  };

  const criticalAlerts = mockSupplyAlerts.filter(a => a.severity === 'critical').length;
  const highPriorityItems = mockSupplyAlerts.filter(a => a.severity === 'high' || a.severity === 'critical').length;
  const actionRequiredItems = mockSupplyAlerts.filter(a => a.actionRequired).length;
  const totalCostImpact = mockSupplyAlerts.reduce((sum, a) => sum + Math.abs(a.costImpact), 0);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Supply Chain Intelligence</CardTitle>
          </div>
          {criticalAlerts > 0 && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              <AlertTriangle className="h-3 w-3" />
              <span>{criticalAlerts} Critical</span>
            </div>
          )}
        </div>
        <CardDescription>
          AI-powered inventory management and vendor risk assessment
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-lg font-bold text-red-600">{actionRequiredItems}</div>
            <div className="text-xs text-red-600">Urgent Actions</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-lg font-bold text-orange-600">{highPriorityItems}</div>
            <div className="text-xs text-orange-600">High Priority</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-600">89%</div>
            <div className="text-xs text-green-600">AI Accuracy</div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-1">
            <Brain className="h-4 w-4 text-blue-600" />
            <span>AI Supply Chain Alerts</span>
          </h4>
          
          {mockSupplyAlerts.slice(0, 3).map(alert => (
            <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start space-x-2">
                {getTypeIcon(alert.type, alert.severity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium truncate">{alert.title}</h5>
                    <span className="text-xs ml-2 whitespace-nowrap">{alert.timeframe}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{alert.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{alert.item}</span>
                    {alert.actionRequired && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        Action Required
                      </span>
                    )}
                    {alert.costImpact !== 0 && (
                      <span className={`text-xs font-medium ${alert.costImpact > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {alert.costImpact > 0 ? '+' : '-'}${Math.abs(alert.costImpact).toLocaleString()}
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
            <span className="text-sm font-medium text-gray-900">Next 7 Days Prediction:</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">High Confidence</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <div>• 2 critical stockouts predicted without intervention</div>
            <div>• $285K potential revenue impact from supply disruptions</div>
            <div>• 3 vendor performance alerts requiring attention</div>
            <div>• $145K cost savings opportunity identified</div>
          </div>
        </div>

        {/* Cost Impact Summary */}
        <div className="mt-4 pt-3 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-900">Total Cost Impact:</span>
            <span className="text-lg font-bold text-orange-600">${totalCostImpact.toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-500 mb-3">
            Risk exposure + savings opportunities across all supply categories
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onViewDetails}
          >
            <Package className="h-4 w-4 mr-2" />
            View Supply Chain Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}