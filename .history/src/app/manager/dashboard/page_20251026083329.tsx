'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/ui/kpi-card';
import { LineChartComponent } from '@/components/charts/line-chart';
import { withAuth } from '@/hooks/use-auth';
import { useAlert } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { 
  ClipboardList, 
  Lightbulb, 
  TrendingUp, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Settings,
  Target,
  Plus,
  Eye,
  BarChart3,
  FileText,
  Send,
  Calendar,
  Filter,
  Users,
  Activity,
  Heart,
  Package,
  DollarSign,
  Brain,
  ArrowRight
} from 'lucide-react';
import { 
  mockDashboardMetrics, 
  mockKPISubmissions, 
  mockChartData,
  mockAiRecommendations,
  mockAiAnomalies,
  mockAiPredictions
} from '@/utils/mock-data';
import { AiRecommendationsPanel } from '@/components/ai/ai-recommendations-panel';
import { AnomalyDetectionPanel } from '@/components/ai/anomaly-detection-panel';
import { AiPredictionChart } from '@/components/charts/ai-prediction-chart';
import configService from '@/utils/config';
import { SortableDashboard } from '@/components/ui/sortable-dashboard';
import { useSettingsStore } from '@/context/settings-store';
import { CDSSWidget } from '@/components/ai/cdss-widget';
import { WorkforceWidget } from '@/components/workforce/workforce-widget';
import { SupplyChainWidget } from '@/components/supply-chain/supply-chain-widget';
import { PatientFlowWidget } from '@/components/patient-flow/patient-flow-widget';
import { FinancialPerformanceWidget } from '@/components/financial/financial-performance-widget';

function ManagerDashboardPage() {
  const { showAlert } = useAlert();
  const { showSuccess, showInfo, showWarning } = useToast();
  const [selectedKPI, setSelectedKPI] = useState<string>('1');
  const router = useRouter();
  const { settings, updateWidgetOrder, getWidgetOrder, resetWidgetOrder } = useSettingsStore();
  
  // Filter metrics for manager view (department-specific)
  const departmentMetrics = mockDashboardMetrics;
  
  // Recent submissions for this manager
  const recentSubmissions = mockKPISubmissions.slice(0, 5);

  // Department-specific status data
  const departmentAlerts = 2;
  const teamSize = 24;
  const activeTeamMembers = 22;
  const pendingTasks = 7;

  // Mock recommendations based on performance
  const recommendations = [
    {
      id: '1',
      title: 'Reduce Wait Times',
      description: 'Implement a new triage system to reduce average wait times by 15%',
      impact: 'High',
      effort: 'Medium',
      category: 'Operational Efficiency',
      status: 'new',
    },
    {
      id: '2',
      title: 'Staff Training Program',
      description: 'Enhance patient satisfaction through targeted customer service training',
      impact: 'Medium',
      effort: 'Low',
      category: 'Patient Satisfaction',
      status: 'in_progress',
    },
    {
      id: '3',
      title: 'Bed Management Optimization',
      description: 'Improve bed occupancy rates through better discharge planning',
      impact: 'High',
      effort: 'High',
      category: 'Resource Management',
      status: 'new',
    },
  ];

  // Mock monthly submission status
  const submissionStatus = {
    completed: 3,
    total: 4,
    deadline: '2024-07-05',
  };

  return (
    <DashboardLayout title="Manager Dashboard">
      <div className="space-y-6">
        {/* Submission Status Banner */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Monthly KPI Submission Status
                  </h3>
                  <p className="text-blue-700">
                    {submissionStatus.completed} of {submissionStatus.total} KPIs submitted
                  </p>
                  <p className="text-sm text-blue-600">
                    Deadline: {new Date(submissionStatus.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-full bg-blue-200 rounded-full h-2 w-32">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(submissionStatus.completed / submissionStatus.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-blue-800">
                    {Math.round((submissionStatus.completed / submissionStatus.total) * 100)}%
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="premium"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => {
                    // Navigate to KPI form
                    window.location.href = '/manager/kpi-form';
                  }}
                >
                  Submit Remaining KPIs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Department KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departmentMetrics.map((metric) => (
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

        {/* Department Status Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Department Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pending KPIs */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500" 
                  onClick={() => {
                    showInfo('KPI Submission', 'Opening KPI form...');
                    router.push('/manager/kpi-form');
                  }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending KPIs</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl font-bold text-blue-600">{submissionStatus.total - submissionStatus.completed}</p>
                      <p className="text-sm text-blue-500">to submit</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-blue-500">Due {new Date(submissionStatus.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Status */}
            {configService.isScreenEnabled('manager', 'workforceManagement') && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500" 
                    onClick={() => {
                      showInfo('Team Overview', 'Opening workforce management...');
                      router.push('/manager/workforce-management');
                    }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Team Active</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-green-600">{activeTeamMembers}</p>
                        <p className="text-sm text-green-500">of {teamSize}</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Users className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500">{Math.round((activeTeamMembers / teamSize) * 100)}% attendance</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Department Alerts */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-red-500" 
                  onClick={() => {
                    showInfo('Department Alerts', 'Opening department alerts management...');
                    router.push('/manager/clinical-decision-support'); // Using clinical support as alerts page
                  }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl font-bold text-red-600">{departmentAlerts}</p>
                      <p className="text-sm text-red-500">department</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-500">Needs attention</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500" 
                  onClick={() => {
                    showInfo('AI Recommendations', 'Opening recommendations panel...');
                    router.push('/manager/recommendations');
                  }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Suggestions</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl font-bold text-purple-600">{recommendations.filter(r => r.status === 'new').length}</p>
                      <p className="text-sm text-purple-500">new</p>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Lightbulb className="h-3 w-3 text-purple-500" />
                      <span className="text-xs text-purple-500">View recommendations</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Status Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Patient Flow Status */}
            {configService.isScreenEnabled('manager', 'patientFlowManagement') && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-indigo-500" 
                    onClick={() => {
                      showInfo('Patient Flow Details', 'Opening detailed patient flow analysis...');
                      router.push('/manager/patient-flow-management');
                    }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Patient Wait Time</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-indigo-600">12</p>
                        <p className="text-sm text-indigo-500">minutes avg</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Heart className="h-3 w-3 text-indigo-500" />
                        <span className="text-xs text-indigo-500">Below target (15 min)</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Supply Status */}
            {configService.isScreenEnabled('manager', 'supplyChainIntelligence') && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-orange-500" 
                    onClick={() => {
                      showInfo('Supply Status', 'Opening supply chain intelligence...');
                      router.push('/manager/supply-chain-intelligence');
                    }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Supply Status</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-orange-600">Good</p>
                        <p className="text-sm text-orange-500">overall</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Package className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-orange-500">1 item needs reorder</span>
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
            {configService.isScreenEnabled('manager', 'financialPerformance') && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-teal-500" 
                    onClick={() => {
                      showInfo('Financial Overview', 'Opening financial performance...');
                      router.push('/manager/financial-performance');
                    }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Dept. Budget</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-teal-600">78%</p>
                        <p className="text-sm text-teal-500">utilized</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <DollarSign className="h-3 w-3 text-teal-500" />
                        <span className="text-xs text-teal-500">Under budget</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-teal-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KPI Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Department Performance Trend</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // Create department performance CSV
                      const csvContent = 'Month,Performance Value,Target,Variance\n' +
                        mockChartData.map(item => {
                          const target = 85; // Example target
                          const variance = item.value - target;
                          return `${item.date},${item.value},${target},${variance > 0 ? '+' : ''}${variance}`;
                        }).join('\n');
                      
                      // Create and download file
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `department-performance-trends-${new Date().toISOString().split('T')[0]}.csv`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(event) => {
                      // Show loading state and refresh data
                      const button = event.currentTarget as HTMLButtonElement;
                      button.disabled = true;
                      const icon = button.querySelector('svg');
                      if (icon) {
                        icon.classList.add('animate-spin');
                      }
                      
                      // Simulate data refresh
                      setTimeout(() => {
                        button.disabled = false;
                        if (icon) {
                          icon.classList.remove('animate-spin');
                        }
                        // In a real app, this would fetch fresh data from the API
                        console.log('Department performance data refreshed');
                        alert('✅ Performance data refreshed successfully!');
                      }, 2000);
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Track your department&apos;s KPI performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={mockChartData}
                height="medium"
                color="#3B82F6"
                showTarget={true}
                xAxisLabel="Month"
                yAxisLabel="Performance Value"
                onPointClick={(data) => 
                  window.alert(`Data point clicked - Month: ${data.date}, Value: ${data.value}`)
                }
              />
            </CardContent>
          </Card>

          {/* Recent Submissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Submissions
                <Button
                  size="sm"
                  onClick={() => {
                    // Navigate to KPI form
                    window.location.href = '/manager/kpi-form';
                  }}
                >
                  New Submission
                </Button>
              </CardTitle>
              <CardDescription>
                Your latest KPI submissions and their status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => window.alert(`Opening submission details for ${submission.month}/${submission.year}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      submission.status === 'approved' 
                        ? 'bg-green-500' 
                        : submission.status === 'submitted'
                        ? 'bg-yellow-500'
                        : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Wait Time - {submission.month}/{submission.year}
                      </p>
                      <p className="text-xs text-gray-500">
                        Value: {submission.value} minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        submission.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : submission.status === 'submitted'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {submission.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {submission.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.alert(`Editing submission for ${submission.month}/${submission.year}`);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <span>Improvement Recommendations</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    showInfo('Navigating', 'Opening recommendations management page...');
                    window.location.href = '/manager/recommendations';
                  }}
                >
                  View All
                </Button>
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => showAlert({
                    type: 'info',
                    title: 'Generating Recommendations',
                    message: 'AI is analyzing your latest KPI data to generate personalized improvement recommendations.\n\nThis process typically takes 30-60 seconds.\n\nYou will be notified when new recommendations are ready.'
                  })}
                >
                  Generate New
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              AI-powered suggestions to improve your department&apos;s KPIs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => window.alert(`Opening recommendation details: ${recommendation.title}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {recommendation.title}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        recommendation.status === 'new'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {recommendation.status === 'new' ? 'New' : 'In Progress'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {recommendation.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="text-gray-500">
                        <strong>Category:</strong> {recommendation.category}
                      </span>
                      <span className={`${
                        recommendation.impact === 'High'
                          ? 'text-red-600'
                          : recommendation.impact === 'Medium'
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}>
                        <strong>Impact:</strong> {recommendation.impact}
                      </span>
                      <span className="text-gray-500">
                        <strong>Effort:</strong> {recommendation.effort}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.alert(`Implementing recommendation: ${recommendation.title}`);
                      }}
                    >
                      {recommendation.status === 'new' ? 'Implement' : 'Update'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.alert(`Dismissing recommendation: ${recommendation.title}`);
                      }}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Quick Actions
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.alert('Customizing quick actions...')}
              >
                <Settings className="h-4 w-4 mr-1" />
                Customize
              </Button>
            </CardTitle>
            <CardDescription>
              Frequently used manager functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="p-4 h-auto text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                onClick={() => {
                  // Navigate to KPI form
                  window.location.href = '/manager/kpi-form';
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Submit KPIs</h3>
                    <p className="text-sm text-gray-600">Enter monthly KPI data</p>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="p-4 h-auto text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                onClick={() => window.alert('Opening submission history...')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">View History</h3>
                    <p className="text-sm text-gray-600">Check past submissions</p>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="p-4 h-auto text-left border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
                onClick={() => {
                  // Navigate to recommendations page
                  window.location.href = '/manager/recommendations';
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Get Insights</h3>
                    <p className="text-sm text-gray-600">AI-powered recommendations</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights for Managers */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">AI-Powered Insights</h2>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.alert('Configuring department AI settings...')}
              >
                Configure AI
              </Button>
              <Button
                size="sm"
                onClick={() => window.alert('Generating fresh AI insights for department...')}
              >
                Refresh Insights
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department-specific Predictions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Department Predictions</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.alert('Exporting prediction data for department...')}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
              {mockAiPredictions
                .filter(p => p.departmentId === '1') // Emergency department for manager
                .slice(0, 1)
                .map((prediction) => (
                <AiPredictionChart 
                  key={prediction.id}
                  prediction={prediction}
                  historicalData={mockChartData}
                />
              ))}
            </div>
            
            {/* Department Anomalies */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Department Anomalies</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.alert('Viewing anomaly resolution history...')}
                >
                  History
                </Button>
              </div>
              <AnomalyDetectionPanel 
                anomalies={mockAiAnomalies.filter(a => a.departmentId === '1')}
                onResolveAnomaly={(id) => {
                  window.alert(`Manager resolving anomaly: ${id}`);
                  console.log('Manager resolving anomaly:', id);
                }}
              />
            </div>
          </div>
          
          {/* AI Recommendations for Department */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Department AI Recommendations</h3>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.alert('Requesting custom recommendations for department...')}
                >
                  Request Custom
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.alert('Viewing implementation analytics...')}
                >
                  Analytics
                </Button>
              </div>
            </div>
            <AiRecommendationsPanel 
              recommendations={mockAiRecommendations.filter(r => 
                r.hospitalId === '1' && (r.departmentId === '1' || !r.departmentId)
              )}
              onUpdateStatus={(id, status) => {
                window.alert(`Manager updating recommendation ${id} to status: ${status}`);
                console.log('Manager updating recommendation:', id, status);
              }}
              onAssignRecommendation={(id, userId) => {
                window.alert(`Assigning recommendation ${id} to user: ${userId}`);
                console.log('Assigning recommendation:', id, userId);
              }}
            />
          </div>
        </div>

        {/* Customizable Widgets (Draggable & per-user persisted) */}
        {(() => {
          const defaultWidgets = [
            {
              id: 'cdss-widget',
              title: 'Clinical Decision Support',
              component: configService.isClinicalDecisionSupportEnabled('manager') && settings?.dashboardModules?.clinicalAI ? (
                <CDSSWidget 
                  userRole="manager"
                  onOpenFullCDSS={() => router.push('/manager/clinical-decision-support')}
                />
              ) : null,
              order: 1,
              enabled: (settings?.dashboardModules?.clinicalAI ?? true) && configService.isClinicalDecisionSupportEnabled('manager'),
            },
            {
              id: 'workforce-widget',
              title: 'Workforce Management',
              component: settings?.dashboardModules?.workforceManagement ? (
                <WorkforceWidget onViewDetails={() => router.push('/manager/workforce-management')} />
              ) : null,
              order: 2,
              enabled: settings?.dashboardModules?.workforceManagement || false,
            },
            {
              id: 'supply-chain-widget',
              title: 'Supply Chain Intelligence',
              component: settings?.dashboardModules?.supplyChain ? (
                <SupplyChainWidget onViewDetails={() => router.push('/manager/supply-chain-intelligence')} />
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

          const savedOrder = getWidgetOrder('manager');
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
                updateWidgetOrder('manager', idOrder);
              }}
              onSaveOrder={() => {}}
              onResetOrder={() => resetWidgetOrder('manager')}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              gridCols={3}
            />
          );
        })()}
      </div>
    </DashboardLayout>
  );
}

export default withAuth(ManagerDashboardPage, { requiredRole: 'manager' });