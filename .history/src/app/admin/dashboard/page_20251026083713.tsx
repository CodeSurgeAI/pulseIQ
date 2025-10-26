'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/ui/kpi-card';
import { LineChartComponent } from '@/components/charts/line-chart';
import { BarChartComponent } from '@/components/charts/bar-chart';
import { withAuth } from '@/hooks/use-auth';
import { useAlert } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { 
  Users, 
  Building2, 
  Activity, 
  TrendingUp,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Eye,
  Plus,
  Settings,
  Brain,
  BarChart3,
  FileText,
  Search,
  Filter,
  Edit,
  Trash2,
  Heart,
  Package,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { 
  mockHospitals, 
  mockUsers, 
  mockAlerts,
  mockFederatedLearningStatus,
  mockMlGatewayStatus,
  mockAiAnomalies,
  mockKPIs
} from '@/utils/mock-data';
import { FederatedLearningStatus } from '@/components/ai/federated-learning-status';
import { MlGatewayStatusComponent } from '@/components/ai/ml-gateway-status';
import { AnomalyDetectionPanel } from '@/components/ai/anomaly-detection-panel';
import { ActivityLogModal } from '@/components/ui/activity-log-modal';
import { CDSSWidget } from '@/components/ai/cdss-widget';
import { WorkforceWidget } from '@/components/workforce/workforce-widget';
import { SupplyChainWidget } from '@/components/supply-chain/supply-chain-widget';
import { PatientFlowWidget } from '@/components/patient-flow/patient-flow-widget';
import { FinancialPerformanceWidget } from '@/components/financial/financial-performance-widget';
import { SortableDashboard } from '@/components/ui/sortable-dashboard';
import { DraggableWidget } from '@/components/ui/draggable-widget';
import { useSettingsStore } from '@/context/settings-store';
import configService from '@/utils/config';

function AdminDashboardPage() {
  const { showAlert } = useAlert();
  const { showSuccess, showInfo, showWarning } = useToast();
  const { settings, updateWidgetOrder, getWidgetOrder, resetWidgetOrder } = useSettingsStore();
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const router = useRouter();
  
  // Calculate system-wide metrics for admin view
  const totalHospitals = mockHospitals.length;
  const activeUsers = mockUsers.filter(user => user.isActive).length;
  const totalUsers = mockUsers.length;
  const criticalAlerts = mockAlerts.filter(alert => alert.severity === 'critical' && !alert.isRead).length;
  const systemUptime = 99.8; // Mock uptime percentage

  const systemMetrics = [
    {
      id: 'hospitals',
      title: 'Total Hospitals',
      value: totalHospitals,
      change: '+2',
      changeType: 'positive' as const,
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      id: 'users',
      title: 'Active Users',
      value: activeUsers,
      subtitle: `${totalUsers} total`,
      change: '+5',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-green-500',
    },
  ];

  // Filter system metrics based on config settings
  const filteredSystemMetrics = systemMetrics.filter(metric => {
    switch (metric.id) {
      case 'hospitals':
        return configService.isScreenEnabled('admin', 'hospitals');
      case 'users':
        return configService.isScreenEnabled('admin', 'users');
      default:
        return true;
    }
  });

  // Mock data for hospital performance chart
  const hospitalPerformanceData = [
    { date: 'General Hospital', value: 92.5 },
    { date: 'City Medical', value: 89.2 },
    { date: 'Metro Health', value: 87.8 },
    { date: 'Regional Care', value: 85.3 },
    { date: 'Community Med', value: 82.1 },
  ];

  // Mock data for monthly user registrations
  const userRegistrationData = [
    { date: 'Jan', value: 12 },
    { date: 'Feb', value: 18 },
    { date: 'Mar', value: 15 },
    { date: 'Apr', value: 22 },
    { date: 'May', value: 28 },
    { date: 'Jun', value: 25 },
  ];

  // KPI Overview: group KPIs into requested categories for quick visibility
  const kpiCategories: { key: 'clinical_quality' | 'operational_efficiency' | 'financial_performance' | 'patient_satisfaction' | 'staff_performance'; title: string; description: string }[] = [
    { key: 'clinical_quality', title: 'Clinical Quality', description: 'Outcomes, safety, and excellence in patient care' },
    { key: 'operational_efficiency', title: 'Operational Efficiency', description: 'Resource utilization and service delivery' },
    { key: 'financial_performance', title: 'Financial Performance', description: 'Profitability, collections, and cost control' },
    { key: 'patient_satisfaction', title: 'Patient Experience', description: 'Satisfaction, loyalty, and engagement' },
    { key: 'staff_performance', title: 'Staff & HR', description: 'Workforce stability and development' },
  ];

  const kpisByCategory = Object.fromEntries(
    kpiCategories.map(({ key }) => [
      key,
      mockKPIs.filter(k => k.category === key).slice(0, 6),
    ])
  ) as Record<string, typeof mockKPIs>;

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSystemMetrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <Card key={metric.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {metric.title}
                      </p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {metric.value}
                        </p>
                        {metric.subtitle && (
                          <p className="text-sm text-gray-500">
                            {metric.subtitle}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <span
                          className={`text-sm font-medium ${
                            metric.changeType === 'positive'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {metric.change}
                        </span>
                        <span className="text-sm text-gray-500">
                          this month
                        </span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* System Status Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Critical Alerts */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-red-500" 
                  onClick={() => {
                    showInfo('Critical Alerts', 'Opening critical alerts management page...');
                    router.push('/admin/workforce-management'); // Using workforce management as alerts management
                  }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl font-bold text-red-600">{criticalAlerts}</p>
                      <p className="text-sm text-red-500">active</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-500">Requires attention</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Uptime */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500" 
                  onClick={() => {
                    showInfo('System Health', 'Opening system health monitoring page...');
                    router.push('/admin/clinical-decision-support'); // Using clinical support as system health
                  }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Uptime</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl font-bold text-green-600">{systemUptime}%</p>
                      <p className="text-sm text-green-500">online</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500">All systems operational</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500" 
                  onClick={() => {
                    showInfo('User Management', 'Opening user management page...');
                    router.push(configService.isScreenEnabled('admin', 'users') ? '/admin/users' : '/admin/user-registration-details');
                  }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl font-bold text-blue-600">{activeUsers}</p>
                      <p className="text-sm text-blue-500">of {totalUsers}</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Users className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-blue-500">Currently online</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hospital Network - Only show if hospitals screen is enabled */}
            {configService.isScreenEnabled('admin', 'hospitals') && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500" 
                    onClick={() => {
                      showInfo('Hospital Network', 'Opening hospital management page...');
                      router.push('/admin/hospitals');
                    }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Hospital Network</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-purple-600">{totalHospitals}</p>
                        <p className="text-sm text-purple-500">facilities</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Building2 className="h-3 w-3 text-purple-500" />
                        <span className="text-xs text-purple-500">All connected</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hospital Performance */}
          {settings?.dashboardModules?.hospitals && configService.isScreenEnabled('admin', 'hospitals') && (
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Hospital Performance Scores
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="info"
                    icon={<Download className="h-4 w-4" />}
                    onClick={() => {
                      // Create CSV content
                      const csvContent = 'Hospital,Performance Score,Rank\n' +
                        hospitalPerformanceData.map((item, index) => 
                          `${item.date},${item.value},${index + 1}`
                        ).join('\n');
                      
                      // Create and download file
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `hospital-performance-${new Date().toISOString().split('T')[0]}.csv`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    Export
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // Show loading state and refresh data
                      const button = event?.currentTarget as HTMLButtonElement;
                      if (button) {
                        button.disabled = true;
                        const icon = button.querySelector('svg');
                        if (icon) icon.classList.add('animate-spin');
                        
                        // Simulate data refresh
                        setTimeout(() => {
                          button.disabled = false;
                          if (icon) icon.classList.remove('animate-spin');
                          // In a real app, this would fetch fresh data from the API
                          console.log('Hospital performance data refreshed');
                        }, 2000);
                      }
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Overall performance ranking of all hospitals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={hospitalPerformanceData}
                height="medium"
                color="#3B82F6"
                onBarClick={(data) => {
                  // Create detailed performance breakdown
                  const performanceDetails = `
🏥 Hospital: ${data.date}
📊 Overall Score: ${data.value}%

📈 Performance Breakdown:
• Patient Satisfaction: ${Math.floor(Math.random() * 20) + 80}%
• Wait Times: ${Math.floor(Math.random() * 25) + 70}%
• Readmission Rate: ${Math.floor(Math.random() * 30) + 65}%
• Staff Efficiency: ${Math.floor(Math.random() * 20) + 75}%

💡 Click OK to view detailed hospital dashboard
                  `;
                  
                  const viewDetails = confirm(performanceDetails);
                  if (viewDetails) {
                    // In a real app, navigate to hospital-specific dashboard
                    console.log(`Navigating to ${data.date} detailed dashboard`);
                    // Could implement: window.location.href = `/admin/hospitals/${hospitalId}/dashboard`;
                  }
                }}
              />
            </CardContent>
          </Card>
          )}

          {/* User Registrations Trend */}
          {settings?.dashboardModules?.users && configService.isScreenEnabled('admin', 'users') && configService.isScreenEnabled('admin', 'userRegistrationDetails') && (
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                User Registrations
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // Navigate to detailed user registration analytics page
                      window.location.href = '/admin/user-registration-details';
                    }}
                  >
                    Details
                  </Button>
                  <Button
                    size="sm"
                    variant="premium"
                    onClick={() => {
                      showInfo('Opening User Management', 'Navigating to user management page...');
                      window.location.href = '/admin/users';
                    }}
                  >
                    Manage Users
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Monthly new user registrations across all hospitals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={userRegistrationData}
                height="medium"
                color="#10B981"
                showTarget={false}
                onPointClick={(data) => {
                  // Create detailed monthly breakdown
                  const monthDetails = `
📅 Month: ${data.date}
👥 New Registrations: ${data.value} users

🏥 Breakdown by Hospital Type:
• General Hospitals: ${Math.floor(data.value * 0.4)} users
• Specialized Centers: ${Math.floor(data.value * 0.3)} users
• Regional Clinics: ${Math.floor(data.value * 0.3)} users

📊 User Roles:
• Managers: ${Math.floor(data.value * 0.6)} users
• Staff: ${Math.floor(data.value * 0.4)} users

💡 Click OK to view detailed user management
                  `;
                  
                  const viewUsers = confirm(monthDetails);
                  if (viewUsers) {
                    window.location.href = '/admin/users';
                  }
                }}
              />
            </CardContent>
          </Card>
          )}
        </div>

        {/* Recent Activities & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Activities
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsActivityLogOpen(true);
                    showInfo('Opening Log', 'Loading comprehensive activity log...');
                  }}
                >
                  View All
                </Button>
              </CardTitle>
              <CardDescription>
                Latest system activities and user actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div 
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => showInfo('Opening Details', 'Opening hospital details: Regional Medical Center')}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New hospital registered: &ldquo;Regional Medical Center&rdquo;
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div 
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => showInfo('Viewing Users', 'Viewing new users at General Hospital')}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      5 new users added to General Hospital
                    </p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div 
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => showInfo('Viewing Status', 'Viewing KPI submission status')}
                >
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      KPI submission deadline reminder sent
                    </p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
                <div 
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => showWarning('Investigating', 'Investigating critical alert details')}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Critical alert: High readmission rate detected
                    </p>
                    <p className="text-xs text-gray-500">8 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                System Status
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => showInfo('Opening Diagnostics', 'Viewing detailed system diagnostics...')}
                  >
                    Diagnostics
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => showInfo('Refreshing', 'Refreshing system status...')}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Current system health and service status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div 
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => showAlert({
                    type: 'info',
                    title: 'API Service Status',
                    message: 'All API services are operational and running smoothly.\n\nUptime: 99.9%\nResponse Time: <100ms\nLast Check: Just now'
                  })}
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        API Services
                      </p>
                      <p className="text-xs text-green-700">All systems operational</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    Online
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        Database
                      </p>
                      <p className="text-xs text-green-700">Connection stable</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    Online
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        Authentication
                      </p>
                      <p className="text-xs text-green-700">Service available</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    Online
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clinical AI Decision Support (Draggable & per-user persisted) */}
        {(() => {
          // Define default widgets for Admin dashboard
          const defaultWidgets = [
            {
              id: 'cdss-widget',
              title: 'Clinical Decision Support',
              component: settings?.dashboardModules?.clinicalAI ? (
                <CDSSWidget 
                  userRole="admin"
                  onOpenFullCDSS={() => {
                    showInfo('Opening Clinical AI', 'Loading comprehensive clinical decision support...');
                    window.location.href = '/admin/clinical-decision-support';
                  }}
                />
              ) : null,
              order: 1,
              enabled: settings?.dashboardModules?.clinicalAI || false
            },
            {
              id: 'workforce-widget',
              title: 'Workforce Management',
              component: settings?.dashboardModules?.workforceManagement ? (
                <WorkforceWidget 
                  onViewDetails={() => {
                    showInfo('Opening Workforce Management', 'Loading AI-powered staffing optimization...');
                    window.location.href = '/admin/workforce-management';
                  }}
                />
              ) : null,
              order: 2,
              enabled: settings?.dashboardModules?.workforceManagement || false
            },
            {
              id: 'supply-chain-widget',
              title: 'Supply Chain Intelligence',
              component: settings?.dashboardModules?.supplyChain ? (
                <SupplyChainWidget 
                  onViewDetails={() => {
                    showInfo('Opening Supply Chain Intelligence', 'Loading AI-powered inventory management...');
                    window.location.href = '/admin/supply-chain-intelligence';
                  }}
                />
              ) : null,
              order: 3,
              enabled: settings?.dashboardModules?.supplyChain || false
            },
            {
              id: 'patient-flow-widget',
              title: 'Patient Flow Management',
              component: settings?.dashboardModules?.patientFlow ? (
                <PatientFlowWidget />
              ) : null,
              order: 4,
              enabled: settings?.dashboardModules?.patientFlow || false
            },
            {
              id: 'financial-performance-widget',
              title: 'Financial Performance',
              component: settings?.dashboardModules?.financialPerformance ? (
                <FinancialPerformanceWidget />
              ) : null,
              order: 5,
              enabled: settings?.dashboardModules?.financialPerformance || false
            }
          ].filter(widget => widget.enabled);

          // Apply saved order for this user/dashboard
          const savedOrder = getWidgetOrder('admin'); // array of widget IDs
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
                updateWidgetOrder('admin', idOrder);
              }}
              onSaveOrder={() => {
                // Persisted immediately; this provides user feedback via SortableDashboard
              }}
              onResetOrder={() => {
                resetWidgetOrder('admin');
              }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              gridCols={3}
            />
          );
        })()}

        {/* AI-Powered Clinical Intelligence */}
        {settings?.dashboardModules?.clinicalAI && (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <span>AI-Powered Clinical Intelligence</span>
                  </CardTitle>
                  <CardDescription>
                    Real-time predictions and recommendations for patient care
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">78%</div>
                      <div className="text-sm text-red-700">Sepsis Risk</div>
                      <div className="text-xs text-red-500">Maria Rodriguez • ICU-204</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">62%</div>
                      <div className="text-sm text-orange-700">Deterioration Risk</div>
                      <div className="text-xs text-orange-500">James Thompson • Med-315</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">3</div>
                      <div className="text-sm text-yellow-700">Drug Interactions</div>
                      <div className="text-xs text-yellow-500">Active warnings</div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="premium"
                      onClick={() => {
                        showInfo('Opening Clinical AI', 'Loading full clinical decision support system...');
                        window.location.href = '/admin/clinical-decision-support';
                      }}
                    >
                      Access Full Clinical AI System
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* AI & ML Section */}
        {settings?.dashboardModules?.clinicalAI && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">AI & Machine Learning</h2>
            </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ML Gateway Status */}
            <MlGatewayStatusComponent 
              status={mockMlGatewayStatus}
            />
            
            {/* System-wide Anomalies */}
            <AnomalyDetectionPanel 
              anomalies={mockAiAnomalies}
              onResolveAnomaly={(id) => console.log('Resolving anomaly:', id)}
            />
          </div>
          
          {/* Federated Learning Network */}
          <FederatedLearningStatus 
            statuses={mockFederatedLearningStatus}
          />
        </div>
        )}
      </div>

      {/* Activity Log Modal */}
      <ActivityLogModal
        isOpen={isActivityLogOpen}
        onClose={() => setIsActivityLogOpen(false)}
        title="System Activity Log"
        userRole="admin"
      />
    </DashboardLayout>
  );
}

export default withAuth(AdminDashboardPage, { requiredRole: 'admin' });