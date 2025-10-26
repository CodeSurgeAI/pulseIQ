'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/ui/kpi-card';
import { LineChartComponent } from '@/components/charts/line-chart';
import { BarChartComponent } from '@/components/charts/bar-chart';
import { LeaderboardTable } from '@/components/ui/leaderboard-table';
import { withAuth } from '@/hooks/use-auth';
import { useAlert } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { ActivityLogModal } from '@/components/ui/activity-log-modal';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building, 
  Activity, 
  Award, 
  AlertTriangle, 
  Target,
  Download,
  RefreshCw,
  Eye,
  BarChart3,
  Settings,
  FileText,
  Calendar,
  CheckCircle,
  Bell,
  Search,
  Filter,
  Brain,
  Heart,
  Package,
  DollarSign,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { 
  mockDashboardMetrics, 
  mockChartData, 
  mockLeaderboard, 
  mockAlerts,
  mockAiPredictions,
  mockAiRecommendations,
  mockAiAnomalies
} from '@/utils/mock-data';
import { AiPredictionChart } from '@/components/charts/ai-prediction-chart';
import { AiRecommendationsPanel } from '@/components/ai/ai-recommendations-panel';
import { AnomalyDetectionPanel } from '@/components/ai/anomaly-detection-panel';
import configService from '@/utils/config';
import { SortableDashboard } from '@/components/ui/sortable-dashboard';
import { useSettingsStore } from '@/context/settings-store';
import { CDSSWidget } from '@/components/ai/cdss-widget';
import { WorkforceWidget } from '@/components/workforce/workforce-widget';
import { SupplyChainWidget } from '@/components/supply-chain/supply-chain-widget';
import { PatientFlowWidget } from '@/components/patient-flow/patient-flow-widget';
import { FinancialPerformanceWidget } from '@/components/financial/financial-performance-widget';

function DirectorDashboardPage() {
  const { showAlert } = useAlert();
  const { showSuccess, showInfo, showWarning } = useToast();
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const router = useRouter();
  const { settings, updateWidgetOrder, getWidgetOrder, resetWidgetOrder } = useSettingsStore();
  
  // Filter metrics for director view (hospital-specific)
  const hospitalMetrics = mockDashboardMetrics;
  
  // Recent alerts for this hospital
  const recentAlerts = mockAlerts.slice(0, 3);

  // Department performance data (mock)
  const departmentPerformanceData = [
    { date: 'Emergency', value: 88.5 },
    { date: 'Cardiology', value: 91.2 },
    { date: 'Pediatrics', value: 93.8 },
    { date: 'Surgery', value: 87.4 },
    { date: 'ICU', value: 89.7 },
  ];

  // Monthly trends data (mock)
  const monthlyTrendsData = [
    { date: 'Jan', value: 85.2, target: 85 },
    { date: 'Feb', value: 87.1, target: 85 },
    { date: 'Mar', value: 88.5, target: 85 },
    { date: 'Apr', value: 90.2, target: 85 },
    { date: 'May', value: 91.8, target: 85 },
    { date: 'Jun', value: 92.5, target: 85 },
  ];

  return (
    <DashboardLayout title="Director Dashboard">
      <div className="space-y-6">
        {/* Hospital KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hospitalMetrics.map((metric) => (
            <KPICard
              key={metric.kpiId}
              metric={metric}
              showTarget={true}
              interactive={true}
              onViewDetails={(metric) => {
                console.log('Viewing details for:', metric.kpiName);
                // Could also integrate with analytics or reporting here
              }}
            />
          ))}
        </div>

  {/* Hospital Status Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Hospital Status Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Alerts */}
            {configService.isScreenEnabled('director', 'alerts') && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-red-500" 
                    onClick={() => {
                      showInfo('Viewing Alerts', 'Opening hospital alerts...');
                      router.push('/director/alerts');
                    }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-red-600">{recentAlerts.length}</p>
                        <p className="text-sm text-red-500">notifications</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Bell className="h-3 w-3 text-red-500" />
                        <span className="text-xs text-red-500">View all alerts</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Bell className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Department Performance */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500" 
                  onClick={() => {
                    showInfo('Department Performance', 'Opening department performance analysis...');
                    router.push('/director/financial-performance');
                  }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Dept. Average</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl font-bold text-green-600">89.2%</p>
                      <p className="text-sm text-green-500">performance</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500">+2.1% vs last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Staff Status */}
            {configService.isScreenEnabled('director', 'workforceManagement') && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500" 
                    onClick={() => {
                      showInfo('Staff Overview', 'Opening workforce management...');
                      router.push('/director/workforce-management');
                    }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Staff On-Duty</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-blue-600">127</p>
                        <p className="text-sm text-blue-500">of 145</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Users className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-blue-500">87.6% attendance</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leaderboard Ranking */}
            {configService.isScreenEnabled('director', 'leaderboard') && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-yellow-500" 
                    onClick={() => {
                      showInfo('Hospital Ranking', 'Opening leaderboard...');
                      router.push('/director/leaderboard');
                    }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Hospital Rank</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-yellow-600">#2</p>
                        <p className="text-sm text-yellow-500">network wide</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Trophy className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-yellow-500">View full rankings</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Additional Status Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Patient Flow Status */}
            {configService.isScreenEnabled('director', 'patientFlowManagement') && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500" 
                    onClick={() => {
                      showInfo('Patient Flow Details', 'Opening detailed patient flow analysis...');
                      router.push('/director/patient-flow-management');
                    }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bed Occupancy</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-purple-600">78%</p>
                        <p className="text-sm text-purple-500">capacity</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Heart className="h-3 w-3 text-purple-500" />
                        <span className="text-xs text-purple-500">Optimal range</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Supply Chain Status */}
            {configService.isScreenEnabled('director', 'supplyChainIntelligence') && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-orange-500" 
                    onClick={() => {
                      showInfo('Supply Status', 'Opening supply chain intelligence...');
                      router.push('/director/supply-chain-intelligence');
                    }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Inventory Status</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-orange-600">Good</p>
                        <p className="text-sm text-orange-500">overall</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Package className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-orange-500">3 items low stock</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Overview */}
            {configService.isScreenEnabled('director', 'financialPerformance') && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-indigo-500" 
                    onClick={() => {
                      showInfo('Financial Overview', 'Opening financial performance...');
                      router.push('/director/financial-performance');
                    }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Budget</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-indigo-600">92%</p>
                        <p className="text-sm text-indigo-500">utilized</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <DollarSign className="h-3 w-3 text-indigo-500" />
                        <span className="text-xs text-indigo-500">On track</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Customizable Widgets (Draggable & per-user persisted) */}
        {(() => {
          const defaultWidgets = [
            {
              id: 'cdss-widget',
              title: 'Clinical Decision Support',
              component: configService.isClinicalDecisionSupportEnabled('director') && settings?.dashboardModules?.clinicalAI ? (
                <CDSSWidget 
                  userRole="director"
                  onOpenFullCDSS={() => router.push('/director/clinical-decision-support')}
                />
              ) : null,
              order: 1,
              enabled: (settings?.dashboardModules?.clinicalAI ?? true) && configService.isClinicalDecisionSupportEnabled('director'),
            },
            {
              id: 'workforce-widget',
              title: 'Workforce Management',
              component: settings?.dashboardModules?.workforceManagement ? (
                <WorkforceWidget onViewDetails={() => router.push('/director/workforce-management')} />
              ) : null,
              order: 2,
              enabled: settings?.dashboardModules?.workforceManagement || false,
            },
            {
              id: 'supply-chain-widget',
              title: 'Supply Chain Intelligence',
              component: settings?.dashboardModules?.supplyChain ? (
                <SupplyChainWidget onViewDetails={() => router.push('/director/supply-chain-intelligence')} />
              ) : null,
              order: 3,
              enabled: settings?.dashboardModules?.supplyChain || false,
            },
            {
              id: 'patient-flow-widget',
              title: 'Patient Flow Management',
              component: settings?.dashboardModules?.patientFlow ? (
                <PatientFlowWidget />
              ) : null,
              order: 4,
              enabled: settings?.dashboardModules?.patientFlow || false,
            },
            {
              id: 'financial-performance-widget',
              title: 'Financial Performance',
              component: settings?.dashboardModules?.financialPerformance ? (
                <FinancialPerformanceWidget />
              ) : null,
              order: 5,
              enabled: settings?.dashboardModules?.financialPerformance || false,
            },
          ].filter(w => w.enabled);

          const savedOrder = getWidgetOrder('director');
          const orderedWidgets = savedOrder.length
            ? [...defaultWidgets]
                .sort((a, b) => {
                  const ia = savedOrder.indexOf(a.id);
                  const ib = savedOrder.indexOf(b.id);
                  return (ia === -1 ? Number.MAX_SAFE_INTEGER : ia) - (ib === -1 ? Number.MAX_SAFE_INTEGER : ib);
                })
                .map((w, idx) => ({ ...w, order: idx }))
            : defaultWidgets;

          return (
            <SortableDashboard
              widgets={orderedWidgets}
              onWidgetOrderChange={(newOrder) => {
                const idOrder = newOrder
                  .filter(w => w.enabled)
                  .sort((a, b) => a.order - b.order)
                  .map(w => w.id);
                updateWidgetOrder('director', idOrder);
              }}
              onSaveOrder={() => {}}
              onResetOrder={() => resetWidgetOrder('director')}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              gridCols={3}
            />
          );
        })()}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Performance Trends</span>
              </CardTitle>
              <CardDescription>
                Overall hospital performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={monthlyTrendsData}
                height="medium"
                color="#3B82F6"
                showTarget={true}
                xAxisLabel="Month"
                yAxisLabel="Performance Score"
                interactive={true}
                onPointClick={(data, index) => {
                  showAlert({
                    type: 'info',
                    title: 'Performance Details',
                    message: `Performance for ${data.date}: ${data.value}% (Target: ${data.target}%)`
                  });
                }}
              />
              <div className="flex justify-end mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Download className="h-4 w-4" />}
                  onClick={() => showSuccess('Export Started', 'Exporting performance trends report...')}
                >
                  Export Chart
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-green-600" />
                <span>Department Performance</span>
              </CardTitle>
              <CardDescription>
                Current performance scores by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={departmentPerformanceData}
                height="medium"
                color="#10B981"
                interactive={true}
                onBarClick={(data, index) => {
                  showAlert({
                    type: 'info',
                    title: 'Department Performance',
                    message: `${data.date} Department Performance: ${data.value}%\n\nClick to view detailed department analytics.`
                  });
                }}
              />
              <div className="flex justify-between items-center mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const filterOptions = [
                      'All Departments',
                      'High Performers (>90%)',
                      'Medium Performers (70-90%)',
                      'Low Performers (<70%)',
                      'Emergency Only',
                      'Surgical Units Only'
                    ];
                    
                    const selectedFilter = prompt(
                      'Select Department Filter:\n\n' +
                      filterOptions.map((option, index) => `${index + 1}. ${option}`).join('\n') +
                      '\n\nEnter number (1-6):'
                    );
                    
                    if (selectedFilter && parseInt(selectedFilter) >= 1 && parseInt(selectedFilter) <= 6) {
                      const selected = filterOptions[parseInt(selectedFilter) - 1];
                      console.log(`Filtering departments by: ${selected}`);
                      // In a real app, this would update the chart data
                      showSuccess('Filter Applied', `Applied filter: ${selected}\n\nChart will update with filtered department data.`);
                    }
                  }}
                >
                  Filter Departments
                </Button>
                <Button
                  size="sm"
                  variant="info"
                  icon={<Download className="h-4 w-4" />}
                  onClick={() => {
                    // Create comprehensive department report
                    const reportData = departmentPerformanceData.map((dept, index) => ({
                      department: dept.date,
                      score: dept.value,
                      rank: index + 1,
                      status: dept.value >= 90 ? 'Excellent' : dept.value >= 75 ? 'Good' : 'Needs Improvement'
                    }));
                    
                    const csvContent = 'Department,Performance Score,Rank,Status\n' +
                      reportData.map(item => 
                        `${item.department},${item.score}%,${item.rank},${item.status}`
                      ).join('\n');
                    
                    // Create and download comprehensive report
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `department-performance-report-${new Date().toISOString().split('T')[0]}.csv`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    
                    showSuccess('Download Complete', '📊 Department Performance Report Downloaded!\n\nIncludes: Scores, Rankings, and Status Analysis');
                  }}
                >
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard and Alerts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Leaderboard */}
          <LeaderboardTable
            entries={[
              {
                hospitalId: '1',
                hospitalName: 'General Hospital',
                departmentId: '3',
                departmentName: 'Pediatrics',
                score: 93.8,
                rank: 1,
                previousRank: 2,
                kpiValues: { '1': 22, '2': 9.1, '3': 7.8, '4': 89 },
              },
              {
                hospitalId: '1',
                hospitalName: 'General Hospital',
                departmentId: '2',
                departmentName: 'Cardiology',
                score: 91.2,
                rank: 2,
                previousRank: 1,
                kpiValues: { '1': 24, '2': 8.8, '3': 8.2, '4': 87 },
              },
              {
                hospitalId: '1',
                hospitalName: 'General Hospital',
                departmentId: '4',
                departmentName: 'ICU',
                score: 89.7,
                rank: 3,
                previousRank: 3,
                kpiValues: { '1': 26, '2': 8.5, '3': 9.1, '4': 85 },
              },
              {
                hospitalId: '1',
                hospitalName: 'General Hospital',
                departmentId: '1',
                departmentName: 'Emergency',
                score: 88.5,
                rank: 4,
                previousRank: 4,
                kpiValues: { '1': 28, '2': 8.3, '3': 9.5, '4': 88 },
              },
            ]}
            title="Department Rankings"
          />

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Recent Alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {recentAlerts.filter(alert => !alert.isRead).length} unread
                  </span>
                  <Button
                    size="sm"
                    variant="success"
                    icon={<CheckCircle className="h-4 w-4" />}
                    onClick={() => {
                      showInfo('Processing', 'Marking all alerts as read...');
                      // In a real app, this would update the alert states
                    }}
                  >
                    Mark All Read
                  </Button>
                  <Button
                    size="sm"
                    variant="info"
                    icon={<Eye className="h-4 w-4" />}
                    onClick={() => {
                      setIsAlertsModalOpen(true);
                      showInfo('Loading Alerts', 'Opening comprehensive alerts management...');
                    }}
                  >
                    View All
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Latest performance alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    alert.isRead
                      ? 'border-gray-200 bg-gray-50'
                      : 'border-orange-200 bg-orange-50'
                  }`}
                  onClick={() => showAlert({
                    type: alert.severity === 'critical' ? 'error' : alert.severity === 'high' ? 'warning' : 'info',
                    title: 'Alert Details',
                    message: `Alert: ${alert.title}\n\nDescription: ${alert.description || 'No additional details available.'}`
                  })}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            alert.severity === 'critical'
                              ? 'bg-red-100 text-red-800'
                              : alert.severity === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        {alert.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {alert.description}
                      </p>
                      {alert.currentValue && alert.threshold && (
                        <div className="mt-2 text-xs text-gray-500">
                          Current: {alert.currentValue} | Target: {alert.threshold}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          showSuccess('Alert Acknowledged', `Acknowledging alert: ${alert.title}`);
                        }}
                      >
                        Acknowledge
                      </Button>
                      {alert.severity === 'critical' && (
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            showInfo('Taking Action', `Taking immediate action for: ${alert.title}`);
                          }}
                        >
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Quick Actions
              <Button
                size="sm"
                variant="outline"
                onClick={() => showInfo('Customizing', 'Opening quick actions menu...')}
              >
                Customize
              </Button>
            </CardTitle>
            <CardDescription>
              Frequently used director functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="p-4 h-auto text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                onClick={() => showInfo('Opening Config', 'Opening KPI targets configuration...')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Set KPI Targets</h3>
                    <p className="text-sm text-gray-600">Update performance targets</p>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="p-4 h-auto text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                onClick={() => showInfo('Opening Dashboard', 'Opening performance review dashboard...')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Performance Review</h3>
                    <p className="text-sm text-gray-600">Review department performance</p>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="p-4 h-auto text-left border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                onClick={() => {
                  // Navigate to alerts page
                  window.location.href = '/director/alerts';
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Manage Alerts</h3>
                    <p className="text-sm text-gray-600">Configure alert thresholds</p>
                  </div>
                </div>
              </Button>
            </div>
            
            {/* Additional Quick Actions Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Button
                variant="outline"
                className="p-4 h-auto text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                onClick={() => showSuccess('Generating Report', 'Generating comprehensive report...')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Download className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Export Reports</h3>
                    <p className="text-sm text-gray-600">Download dashboard data</p>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="p-4 h-auto text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                onClick={() => {
                  // Navigate to leaderboard
                  window.location.href = '/director/leaderboard';
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">View Leaderboard</h3>
                    <p className="text-sm text-gray-600">Hospital rankings</p>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="p-4 h-auto text-left border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors"
                onClick={() => showInfo('Refreshing', 'Refreshing all dashboard data...')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Refresh Data</h3>
                    <p className="text-sm text-gray-600">Update all metrics</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">AI Insights & Predictions</h2>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => showInfo('Opening Settings', 'Configuring AI settings...')}
              >
                Configure AI
              </Button>
              <Button
                size="sm"
                onClick={() => showInfo('Training Models', 'Training new AI models...')}
              >
                Retrain Models
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Predictions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Predictions</h3>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => showSuccess('Exporting Data', 'Exporting prediction data...')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => showInfo('Refreshing', 'Refreshing AI predictions...')}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {mockAiPredictions.slice(0, 2).map((prediction) => (
                <AiPredictionChart 
                  key={prediction.id}
                  prediction={prediction}
                  historicalData={mockChartData}
                />
              ))}
            </div>
            
            {/* Anomalies & Recommendations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Anomalies</h3>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => showInfo('Configuring', 'Configuring anomaly thresholds...')}
                  >
                    Configure
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.alert('Viewing anomaly history...')}
                  >
                    History
                  </Button>
                </div>
              </div>
              <AnomalyDetectionPanel 
                anomalies={mockAiAnomalies.filter(a => a.hospitalId === '1')}
                onResolveAnomaly={(id) => {
                  window.alert(`Resolving anomaly: ${id}`);
                  console.log('Resolving anomaly:', id);
                }}
              />
            </div>
          </div>
          
          {/* AI Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">AI Recommendations</h3>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.alert('Generating new recommendations...')}
                >
                  Generate New
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.alert('Viewing recommendation analytics...')}
                >
                  Analytics
                </Button>
              </div>
            </div>
            <AiRecommendationsPanel 
              recommendations={mockAiRecommendations.filter(r => r.hospitalId === '1')}
              onUpdateStatus={(id, status) => {
                window.alert(`Updating recommendation ${id} to status: ${status}`);
                console.log('Updating recommendation:', id, status);
              }}
            />
          </div>
        </div>
      </div>

      {/* Alerts Modal */}
      <ActivityLogModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        title="Hospital Alerts & Notifications"
        userRole="director"
      />
    </DashboardLayout>
  );
}

export default withAuth(DirectorDashboardPage, { requiredRole: 'director' });