'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChartComponent } from '@/components/charts/line-chart';
import { BarChartComponent } from '@/components/charts/bar-chart';
import { withAuth } from '@/hooks/use-auth';
import { useAlert } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { 
  Users, 
  TrendingUp,
  Calendar,
  Building2,
  UserPlus,
  ArrowLeft,
  Download,
  Filter,
  RefreshCw,
  Eye,
  BarChart3,
  Activity,
  Clock,
  Award,
  AlertTriangle
} from 'lucide-react';

function UserRegistrationDetailsPage() {
  const { showAlert } = useAlert();
  const { showSuccess, showInfo } = useToast();
  
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [selectedHospital, setSelectedHospital] = useState('all');

  // Extended user registration data
  const registrationData = [
    { date: 'Jan 2024', value: 12, target: 15 },
    { date: 'Feb 2024', value: 18, target: 15 },
    { date: 'Mar 2024', value: 15, target: 15 },
    { date: 'Apr 2024', value: 22, target: 15 },
    { date: 'May 2024', value: 28, target: 20 },
    { date: 'Jun 2024', value: 25, target: 20 },
    { date: 'Jul 2024', value: 31, target: 20 },
    { date: 'Aug 2024', value: 29, target: 20 },
    { date: 'Sep 2024', value: 33, target: 25 },
  ];

  // User registration by hospital
  const hospitalRegistrationData = [
    { date: 'General Hospital', value: 45 },
    { date: 'City Medical', value: 38 },
    { date: 'Metro Health', value: 32 },
    { date: 'Regional Care', value: 28 },
    { date: 'Community Med', value: 24 },
    { date: 'Specialty Clinic', value: 18 },
  ];

  // User registration by role
  const roleDistributionData = [
    { date: 'Managers', value: 89 },
    { date: 'Staff Nurses', value: 76 },
    { date: 'Doctors', value: 45 },
    { date: 'Administrators', value: 28 },
    { date: 'Support Staff', value: 22 },
  ];

  // Calculate metrics
  const totalRegistrations = registrationData.reduce((sum, item) => sum + item.value, 0);
  const avgMonthly = Math.round(totalRegistrations / registrationData.length);
  const highestMonth = registrationData.reduce((prev, current) => prev.value > current.value ? prev : current);
  const growth = registrationData.length > 1 ? 
    ((registrationData[registrationData.length - 1].value - registrationData[0].value) / registrationData[0].value * 100) : 0;

  const handleExportData = () => {
    const csvContent = 'Month,Registrations,Target,Variance\n' +
      registrationData.map(item => 
        `${item.date},${item.value},${item.target},${item.value - item.target}`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-registrations-detailed-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => window.history.back()}
              className="w-fit"
            >
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">User Registration Analytics</h1>
              <p className="text-sm lg:text-base text-gray-600">Comprehensive insights into user registration trends and patterns</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              variant="success"
              icon={<Download className="h-4 w-4" />}
              onClick={() => {
                handleExportData();
                showSuccess('Export Complete', 'User registration data has been downloaded successfully!');
              }}
            >
              Export Data
            </Button>
            <Button
              variant="info"
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={() => {
                showInfo('Refreshing', 'Updating registration analytics...');
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{totalRegistrations}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{growth.toFixed(1)}% growth
                  </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Average</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{avgMonthly}</p>
                  <p className="text-sm text-gray-500">
                    users per month
                  </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Peak Month</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{highestMonth.value}</p>
                  <p className="text-sm text-gray-500">
                    {highestMonth.date}
                  </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Target Achievement</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {Math.round((registrationData.filter(item => item.value >= item.target).length / registrationData.length) * 100)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    months on target
                  </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-md">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <h3 className="text-lg font-semibold text-gray-900">Filters & Options</h3>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="12months">Last 12 Months</option>
                  <option value="24months">Last 24 Months</option>
                </select>
                
                <select
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="all">All Hospitals</option>
                  <option value="general">General Hospital</option>
                  <option value="city">City Medical</option>
                  <option value="metro">Metro Health</option>
                  <option value="regional">Regional Care</option>
                </select>
                
                <Button 
                  variant="info" 
                  icon={<Filter className="h-4 w-4" />}
                  onClick={() => showInfo('Filters Applied', 'Registration data updated with selected filters')}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Registration Trends */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Registration Trends</span>
              </CardTitle>
              <CardDescription>
                Monthly user registration trends with targets
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <LineChartComponent
                data={registrationData}
                height="medium"
                color="#3B82F6"
                showTarget={true}
                xAxisLabel="Month"
                yAxisLabel="Registrations"
                onPointClick={(data) => {
                  const variance = data.value - (data.target || 0);
                  const performance = variance >= 0 ? '✅ Above Target' : '⚠️ Below Target';
                  
                  const details = `
📅 Month: ${data.date}
👥 Registrations: ${data.value} users
🎯 Target: ${data.target || 'N/A'}
📊 Variance: ${variance > 0 ? '+' : ''}${variance}
${performance}

💡 Click OK to view detailed monthly breakdown`;
                  
                  const viewMore = confirm(details);
                  if (viewMore) {
                    alert(`Detailed breakdown for ${data.date} would show:\n\n• Registration sources\n• User role distribution\n• Hospital-wise breakdown\n• Time-of-day patterns\n• Completion rates`);
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Hospital Distribution */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-green-600" />
                <span>Registrations by Hospital</span>
              </CardTitle>
              <CardDescription>
                User registration distribution across hospitals
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <BarChartComponent
                data={hospitalRegistrationData}
                height="medium"
                color="#10B981"
                onBarClick={(data) => {
                  const percentage = Math.round((data.value / hospitalRegistrationData.reduce((sum, item) => sum + item.value, 0)) * 100);
                  
                  const details = `
🏥 Hospital: ${data.date}
👥 Total Registrations: ${data.value} users
📊 Share: ${percentage}% of all registrations

📈 Performance Analysis:
• Registration Rate: ${data.value > 30 ? 'High' : data.value > 20 ? 'Medium' : 'Low'}
• Trend: ${data.value > 25 ? 'Growing' : 'Stable'}
• Ranking: #${hospitalRegistrationData.findIndex(item => item.date === data.date) + 1}

💡 Click OK to view hospital-specific details`;
                  
                  const viewHospital = confirm(details);
                  if (viewHospital) {
                    // Navigate to hospital management
                    window.location.href = '/admin/hospitals';
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Role Distribution and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Role Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-purple-600" />
                <span>Registration by User Role</span>
              </CardTitle>
              <CardDescription>
                Distribution of new users by their assigned roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={roleDistributionData}
                height="medium"
                color="#8B5CF6"
                onBarClick={(data) => {
                  const total = roleDistributionData.reduce((sum, item) => sum + item.value, 0);
                  const percentage = Math.round((data.value / total) * 100);
                  
                  const roleInsights = {
                    'Managers': { responsibilities: 'KPI Management, Department Oversight', avgExperience: '5+ years' },
                    'Staff Nurses': { responsibilities: 'Patient Care, Data Entry', avgExperience: '2-5 years' },
                    'Doctors': { responsibilities: 'Medical Oversight, Quality Review', avgExperience: '8+ years' },
                    'Administrators': { responsibilities: 'System Management, Reporting', avgExperience: '3-7 years' },
                    'Support Staff': { responsibilities: 'Data Support, General Tasks', avgExperience: '1-3 years' }
                  };
                  
                  const insight = roleInsights[data.date as keyof typeof roleInsights] || { responsibilities: 'Various', avgExperience: 'Varies' };
                  
                  const details = `
👤 Role: ${data.date}
👥 Registrations: ${data.value} users (${percentage}% of total)
📋 Responsibilities: ${insight.responsibilities}
⏰ Avg Experience: ${insight.avgExperience}

📊 Registration Analysis:
• Demand Level: ${data.value > 50 ? 'High' : data.value > 30 ? 'Medium' : 'Low'}
• Growth Trend: ${data.value > 40 ? 'Increasing' : 'Stable'}

💡 Click OK to view role-specific user management`;
                  
                  const viewRole = confirm(details);
                  if (viewRole) {
                    window.location.href = '/admin/users';
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Recent Registration Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span>Recent Registration Activity</span>
              </CardTitle>
              <CardDescription>
                Latest user registrations and account activations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      5 new managers registered at General Hospital
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago • Emergency Department</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      showInfo('Opening Details', 'Viewing registration details for new managers...');
                      window.location.href = '/admin/users';
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      3 staff nurses completed registration at City Medical
                    </p>
                    <p className="text-xs text-gray-500">4 hours ago • Cardiology Unit</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      showInfo('Opening Details', 'Viewing registration details for staff nurses...');
                      window.location.href = '/admin/users';
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      2 administrators activated accounts at Metro Health
                    </p>
                    <p className="text-xs text-gray-500">6 hours ago • IT Department</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      showInfo('Opening Details', 'Viewing administrator account details...');
                      window.location.href = '/admin/users';
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Registration verification pending for 4 users
                    </p>
                    <p className="text-xs text-gray-500">8 hours ago • Requires admin approval</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="warning" 
                    onClick={() => showAlert({
                      type: 'warning',
                      title: 'Verification Queue',
                      message: 'Opening verification queue...\n\n4 users require manual verification and approval.'
                    })}
                  >
                    <AlertTriangle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <Button
                  variant="premium"
                  className="w-full"
                  onClick={() => {
                    showInfo('Navigating', 'Opening complete registration activity log...');
                    window.location.href = '/admin/users';
                  }}
                >
                  View All Registration Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-gray-50 to-slate-50">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>
              Common tasks related to user registration management
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="premium"
                size="lg"
                icon={<Users className="h-6 w-6" />}
                onClick={() => {
                  showInfo('Navigating', 'Opening user management page...');
                  window.location.href = '/admin/users';
                }}
                className="p-6 h-auto justify-start"
              >
                <div className="text-left ml-3">
                  <h3 className="font-medium text-lg">Manage Users</h3>
                  <p className="text-sm opacity-90">View and manage user accounts</p>
                </div>
              </Button>
              
              <Button
                variant="success"
                size="lg"
                icon={<Download className="h-6 w-6" />}
                onClick={() => {
                  handleExportData();
                  showSuccess('Export Complete', 'Registration analytics data has been downloaded successfully!');
                }}
                className="p-6 h-auto justify-start"
              >
                <div className="text-left ml-3">
                  <h3 className="font-medium text-lg">Export Analytics</h3>
                  <p className="text-sm opacity-90">Download registration data</p>
                </div>
              </Button>
              
              <Button
                variant="info"
                size="lg"
                icon={<Activity className="h-6 w-6" />}
                onClick={() => {
                  showAlert({
                    type: 'info',
                    title: 'Registration Settings',
                    message: '🔧 Available Settings:\n\n• Registration approval workflow\n• Required fields configuration\n• Email notifications\n• Role assignment rules\n• Security settings\n\nWould you like to open the settings panel?'
                  });
                }}
                className="p-6 h-auto justify-start"
              >
                <div className="text-left ml-3">
                  <h3 className="font-medium text-lg">Registration Settings</h3>
                  <p className="text-sm opacity-90">Configure registration process</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(UserRegistrationDetailsPage, { requiredRole: 'admin' });