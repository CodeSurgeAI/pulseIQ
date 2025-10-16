'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Target, BarChart3, Eye, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { cn, formatNumber, formatPercentage, getPerformanceColor } from '@/utils';
import { DashboardMetric } from '@/types';
import { getCategoryColor } from '@/utils/chart-config';
import { LineChartComponent } from '@/components/charts/line-chart';
import { useAlert } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';

interface KPICardProps {
  metric: DashboardMetric;
  className?: string;
  showTarget?: boolean;
  interactive?: boolean;
  onViewDetails?: (metric: DashboardMetric) => void;
}

export function KPICard({ 
  metric, 
  className, 
  showTarget = true, 
  interactive = true,
  onViewDetails
}: KPICardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { showAlert } = useAlert();
  const { showSuccess } = useToast();
  
  const {
    kpiName,
    currentValue,
    previousValue,
    targetValue,
    trend,
    changePercentage,
    unit,
    category,
  } = metric;

  // Mock historical data for charts
  const generateHistoricalData = () => {
    const data = [];
    const baseValue = currentValue;
    const variance = baseValue * 0.15; // 15% variance
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const randomChange = (Math.random() - 0.5) * variance;
      const value = Math.max(0, baseValue + randomChange);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short' }),
        value: value,
        target: targetValue
      });
    }
    
    return data;
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    if (trend === 'stable') return 'text-gray-500';
    // For KPIs where higher is better
    if (category === 'patient_satisfaction' || category === 'operational_efficiency') {
      return trend === 'up' ? 'text-green-600' : 'text-red-600';
    }
    // For KPIs where lower is better (like wait times, readmission rates)
    if (category === 'clinical_quality' && (kpiName.toLowerCase().includes('readmission') || kpiName.toLowerCase().includes('wait'))) {
      return trend === 'down' ? 'text-green-600' : 'text-red-600';
    }
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const performanceColor = targetValue 
    ? getPerformanceColor(currentValue, targetValue, !kpiName.toLowerCase().includes('wait') && !kpiName.toLowerCase().includes('readmission'))
    : 'green';

  const categoryColor = getCategoryColor(category);

  const getPerformanceIndicator = () => {
    if (!targetValue) return null;
    
    const isHigherBetter = !kpiName.toLowerCase().includes('wait') && !kpiName.toLowerCase().includes('readmission');
    const isOnTarget = isHigherBetter 
      ? currentValue >= targetValue 
      : currentValue <= targetValue;
    
    return (
      <div className={cn(
        'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
        {
          'bg-green-100 text-green-700': performanceColor === 'green',
          'bg-yellow-100 text-yellow-700': performanceColor === 'yellow',
          'bg-red-100 text-red-700': performanceColor === 'red',
        }
      )}>
        <Target className="h-3 w-3" />
        <span>{isOnTarget ? 'On Target' : 'Off Target'}</span>
      </div>
    );
  };

  const handleCardClick = () => {
    if (interactive) {
      if (onViewDetails) {
        onViewDetails(metric);
      } else {
        setShowDetailModal(true);
      }
    }
  };

  const handleViewChart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetailModal(true);
  };

  const cardContent = (
    <>
      {/* Category indicator */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: categoryColor }}
      />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600 line-clamp-2">
            {kpiName}
          </h3>
          <div className="flex items-center space-x-2">
            {showTarget && targetValue && getPerformanceIndicator()}
            {interactive && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleViewChart}
                title="View detailed chart"
              >
                <BarChart3 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {/* Current Value */}
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatNumber(currentValue, unit === '%' ? 1 : 0)}
            </span>
            <span className="text-sm text-gray-500">{unit}</span>
          </div>

          {/* Change from previous period */}
          {previousValue !== undefined && (
            <div className={cn("flex items-center space-x-1 text-sm", getTrendColor())}>
              {getTrendIcon()}
              <span className="font-medium">
                {Math.abs(changePercentage) < 0.1 ? '0.0' : formatPercentage(Math.abs(changePercentage))}
              </span>
              <span>vs last period</span>
            </div>
          )}

          {/* Target comparison */}
          {showTarget && targetValue && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Target: {formatNumber(targetValue, unit === '%' ? 1 : 0)}{unit}</span>
              <span>
                {((currentValue / targetValue - 1) * 100).toFixed(1)}% of target
              </span>
            </div>
          )}
        </div>
        
        {interactive && (
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-xs text-gray-400 flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              Click for details
            </div>
          </div>
        )}
      </CardContent>
    </>
  );

  return (
    <>
      <Card 
        className={cn(
          "relative overflow-hidden group",
          interactive && "cursor-pointer hover:shadow-lg transition-all duration-200 hover:ring-2 hover:ring-blue-500/20",
          className
        )}
        onClick={interactive ? handleCardClick : undefined}
      >
        {cardContent}
      </Card>

      {/* KPI Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={kpiName}
        description="Detailed KPI analysis and historical trends"
        size="xl"
      >
        <div className="space-y-6">
          {/* Current Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500 mb-1">Current Value</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(currentValue, unit === '%' ? 1 : 0)}{unit}
              </div>
            </div>
            
            {targetValue && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Target</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(targetValue, unit === '%' ? 1 : 0)}{unit}
                </div>
              </div>
            )}
            
            {previousValue !== undefined && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Change</div>
                <div className={cn("text-2xl font-bold flex items-center space-x-2", getTrendColor())}>
                  {getTrendIcon()}
                  <span>{formatPercentage(Math.abs(changePercentage))}</span>
                </div>
              </div>
            )}
          </div>

          {/* Historical Trend Chart */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">12-Month Trend</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <LineChartComponent
                data={generateHistoricalData()}
                height="large"
                color={categoryColor}
                showTarget={!!targetValue}
                xAxisLabel="Month"
                yAxisLabel={`${kpiName} (${unit})`}
              />
            </div>
          </div>

          {/* Performance Insights */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
            <div className="space-y-3">
              {targetValue && (
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900">Target Performance</div>
                    <div className="text-sm text-blue-700">
                      Currently {((currentValue / targetValue - 1) * 100).toFixed(1)}% 
                      {currentValue > targetValue ? ' above' : ' below'} target
                    </div>
                  </div>
                </div>
              )}
              
              {previousValue !== undefined && (
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getTrendIcon()}
                  <div>
                    <div className="font-medium text-gray-900">Period Comparison</div>
                    <div className="text-sm text-gray-700">
                      {trend === 'up' ? 'Improved' : trend === 'down' ? 'Declined' : 'Stable'} by{' '}
                      {formatPercentage(Math.abs(changePercentage))} from previous period
                      ({formatNumber(previousValue, unit === '%' ? 1 : 0)}{unit})
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-900">Category</div>
                  <div className="text-sm text-green-700 capitalize">
                    {category.replace('_', ' ')} metric
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowDetailModal(false);
              showSuccess('Export Started', 'KPI analysis report will be generated and downloaded.');
            }}>
              Export Report
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}