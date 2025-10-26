'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BarChart3, 
  Trophy, 
  AlertTriangle, 
  ClipboardList, 
  Lightbulb,
  TrendingUp,
  Brain,
  UserCheck,
  Package,
  Menu,
  X,
  Bed,
  DollarSign
} from 'lucide-react';
import { cn } from '@/utils';
import configService from '@/utils/config';
import { usePermissions } from '@/hooks/use-auth';
import { useSettingsStore } from '@/context/settings-store';
import { NavItem } from '@/types';

const navigationItems: NavItem[] = [
  // Admin Navigation
  {
    id: 'admin-dashboard',
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'LayoutDashboard',
    roles: ['admin'],
    settingsModule: null, // Dashboard is always visible
    configKey: 'dashboard',
  },
  {
    id: 'admin-users',
    title: 'Users',
    href: '/admin/users',
    icon: 'Users',
    roles: ['admin'],
    settingsModule: 'users',
    configKey: 'users',
  },
  {
    id: 'admin-hospitals',
    title: 'Hospitals',
    href: '/admin/hospitals',
    icon: 'Building2',
    roles: ['admin'],
    settingsModule: 'hospitals',
    configKey: 'hospitals',
  },
  // Add User Registration Details for admin
  {
    id: 'admin-user-registration-details',
    title: 'User Registration Details',
    href: '/admin/user-registration-details',
    icon: 'Users',
    roles: ['admin'],
    settingsModule: null,
    configKey: 'userRegistrationDetails',
  },
  {
    id: 'admin-cdss',
    title: 'Clinical AI',
    href: '/admin/clinical-decision-support',
    icon: 'Brain',
    roles: ['admin'],
    settingsModule: 'clinicalAI',
    configKey: 'clinicalDecisionSupport',
  },
  {
    id: 'admin-workforce',
    title: 'Workforce Management',
    href: '/admin/workforce-management',
    icon: 'UserCheck',
    roles: ['admin'],
    settingsModule: 'workforceManagement',
    configKey: 'workforceManagement',
  },
  {
    id: 'admin-supply-chain',
    title: 'Supply Chain Intelligence',
    href: '/admin/supply-chain-intelligence',
    icon: 'Package',
    roles: ['admin'],
    settingsModule: 'supplyChain',
    configKey: 'supplyChainIntelligence',
  },
  {
    id: 'admin-patient-flow',
    title: 'Patient Flow & Beds',
    href: '/admin/patient-flow-management',
    icon: 'Bed',
    roles: ['admin'],
    settingsModule: 'patientFlow',
    configKey: 'patientFlowManagement',
  },
  {
    id: 'admin-financial-performance',
    title: 'Financial Performance',
    href: '/admin/financial-performance',
    icon: 'DollarSign',
    roles: ['admin'],
    settingsModule: 'financialPerformance',
    configKey: 'financialPerformance',
  },
  // Admin access to KPI Submission (manager page but allowed for admin)
  {
    id: 'admin-kpi-form',
    title: 'Submit KPIs',
    href: '/manager/kpi-form',
    icon: 'ClipboardList',
    roles: ['admin'],
    settingsModule: 'kpiForm',
    // No admin config toggle; rely on settingsModule and default visibility
    configKey: undefined as any,
  },
  
  // Director Navigation
  {
    id: 'director-dashboard',
    title: 'Dashboard',
    href: '/director/dashboard',
    icon: 'LayoutDashboard',
    roles: ['director'],
    settingsModule: null,
    configKey: 'dashboard',
  },
  {
    id: 'director-leaderboard',
    title: 'Leaderboard',
    href: '/director/leaderboard',
    icon: 'Trophy',
    roles: ['director'],
    settingsModule: 'leaderboard',
    configKey: 'leaderboard',
  },
  {
    id: 'director-cdss',
    title: 'Clinical AI',
    href: '/director/clinical-decision-support',
    icon: 'Brain',
    roles: ['director'],
    settingsModule: 'clinicalAI',
    configKey: 'clinicalDecisionSupport',
  },
  {
    id: 'director-workforce',
    title: 'Workforce Management',
    href: '/director/workforce-management',
    icon: 'UserCheck',
    roles: ['director'],
    settingsModule: 'workforceManagement',
    configKey: 'workforceManagement',
  },
  {
    id: 'director-supply-chain',
    title: 'Supply Chain Intelligence',
    href: '/director/supply-chain-intelligence',
    icon: 'Package',
    roles: ['director'],
    settingsModule: 'supplyChain',
    configKey: 'supplyChainIntelligence',
  },
  {
    id: 'director-patient-flow',
    title: 'Patient Flow & Beds',
    href: '/director/patient-flow-management',
    icon: 'Bed',
    roles: ['director'],
    settingsModule: 'patientFlow',
    configKey: 'patientFlowManagement',
  },
  {
    id: 'director-financial-performance',
    title: 'Financial Performance',
    href: '/director/financial-performance',
    icon: 'DollarSign',
    roles: ['director'],
    settingsModule: 'financialPerformance',
    configKey: 'financialPerformance',
  },
  {
    id: 'director-alerts',
    title: 'Alerts',
    href: '/director/alerts',
    icon: 'AlertTriangle',
    roles: ['director'],
    settingsModule: 'alerts',
    configKey: 'alerts',
  },
  
  // Manager Navigation
  {
    id: 'manager-dashboard',
    title: 'Dashboard',
    href: '/manager/dashboard',
    icon: 'LayoutDashboard',
    roles: ['manager'],
    settingsModule: null,
    configKey: 'dashboard',
  },
  {
    id: 'manager-kpi-form',
    title: 'Submit KPIs',
    href: '/manager/kpi-form',
    icon: 'ClipboardList',
    roles: ['manager'],
    settingsModule: 'kpiForm',
    configKey: 'kpiForm',
  },
  {
    id: 'manager-recommendations',
    title: 'Recommendations',
    href: '/manager/recommendations',
    icon: 'Lightbulb',
    roles: ['manager'],
    settingsModule: 'recommendations',
    configKey: 'recommendations',
  },
  {
    id: 'manager-cdss',
    title: 'Clinical AI',
    href: '/manager/clinical-decision-support',
    icon: 'Brain',
    roles: ['manager'],
    settingsModule: 'clinicalAI',
    configKey: 'clinicalDecisionSupport',
  },
  {
    id: 'manager-workforce',
    title: 'Workforce Management',
    href: '/manager/workforce-management',
    icon: 'UserCheck',
    roles: ['manager'],
    settingsModule: 'workforceManagement',
    configKey: 'workforceManagement',
  },
  {
    id: 'manager-supply-chain',
    title: 'Supply Chain Intelligence',
    href: '/manager/supply-chain-intelligence',
    icon: 'Package',
    roles: ['manager'],
    settingsModule: 'supplyChain',
    configKey: 'supplyChainIntelligence',
  },
  {
    id: 'manager-patient-flow',
    title: 'Patient Flow & Beds',
    href: '/manager/patient-flow-management',
    icon: 'Bed',
    roles: ['manager'],
    settingsModule: 'patientFlow',
    configKey: 'patientFlowManagement',
  },
  {
    id: 'manager-financial-performance',
    title: 'Financial Performance',
    href: '/manager/financial-performance',
    icon: 'DollarSign',
    roles: ['manager'],
    settingsModule: 'financialPerformance',
    configKey: 'financialPerformance',
  },
];

const iconMap = {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  Trophy,
  AlertTriangle,
  ClipboardList,
  Lightbulb,
  TrendingUp,
  Brain,
  UserCheck,
  Package,
  Bed,
  DollarSign,
};

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, hasAnyRole } = usePermissions();
  const { settings } = useSettingsStore();

  if (!user) return null;

  // Filter navigation items based on user role, settings, and config
  const filteredNavItems = navigationItems.filter(item => {
    // Check role-based access
    if (item.roles && !item.roles.includes(user.role)) {
      return false;
    }

    // Check config-based screen visibility first
    if (item.configKey) {
      const isScreenEnabled = configService.isScreenEnabled(user.role, item.configKey);
      if (!isScreenEnabled) {
        return false;
      }
    }

    // Check settings-based visibility (null means always visible like dashboard)
    if (item.settingsModule && settings?.dashboardModules) {
      return settings.dashboardModules[item.settingsModule];
    }

    // If no specific module setting, show by default
    return true;
  });

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-900">
                PulseIQ
              </span>
              <span className="text-xs text-gray-500">
                by CodeSurge AI
              </span>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5 text-gray-600" />
          ) : (
            <X className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {filteredNavItems.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap];
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100",
                  isCollapsed && "justify-center"
                )}
              >
                {IconComponent && (
                  <IconComponent className="h-5 w-5 flex-shrink-0" />
                )}
                {!isCollapsed && (
                  <span className="font-medium">{item.title}</span>
                )}
              </Link>
            );
          })}
        </div>
        
        {/* AI Profitability Section */}
        {!isCollapsed && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                AI Profit Insights
              </h3>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2 text-green-700">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold text-sm">Revenue Optimization</span>
              </div>
              
              <div className="space-y-2 text-xs text-green-800">
                <div className="flex items-center justify-between">
                  <span>Predictive Analytics ROI:</span>
                  <span className="font-semibold text-green-600">+23%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cost Reduction:</span>
                  <span className="font-semibold text-green-600">-18%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Efficiency Gains:</span>
                  <span className="font-semibold text-green-600">+31%</span>
                </div>
              </div>
              
              <div className="border-t border-green-200 pt-3">
                <h4 className="font-medium text-xs text-green-700 mb-2">AI Profit Strategies:</h4>
                <ul className="space-y-1 text-xs text-green-600">
                  <li className="flex items-start space-x-1">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>Demand forecasting reduces waste by 25%</span>
                  </li>
                  <li className="flex items-start space-x-1">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>Optimal staffing saves $50K/month</span>
                  </li>
                  <li className="flex items-start space-x-1">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>Early diagnosis improves outcomes 40%</span>
                  </li>
                  <li className="flex items-start space-x-1">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>Resource allocation optimization</span>
                  </li>
                  <li className="flex items-start space-x-1">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>Preventive maintenance reduces downtime</span>
                  </li>
                </ul>
              </div>
              
              <div className="border-t border-green-200 pt-2">
                <div className="text-xs text-green-600 font-medium">
                  💡 Monthly Profit Impact: <span className="text-green-700">+$120K</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      {/* {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            PulseIQ
            <br />
            by CodeSurge AI • v1.0.0
          </div>
        </div>
      )} */}
    </div>
  );
}