'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  User, 
  Bell, 
  Palette, 
  Download, 
  Upload,
  RotateCcw,
  Save,
  Eye,
  EyeOff,
  Users,
  Building2,
  Brain,
  UserCheck,
  Package,
  Bed,
  DollarSign,
  Trophy,
  AlertTriangle,
  ClipboardList,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/context/settings-store';
import { useAuthStore } from '@/context/auth-store';
import { useToast } from '@/components/ui/toast';
import { UserSettings } from '@/types/settings';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const moduleIcons = {
  users: Users,
  hospitals: Building2,
  clinicalAI: Brain,
  workforceManagement: UserCheck,
  supplyChain: Package,
  patientFlow: Bed,
  financialPerformance: DollarSign,
  leaderboard: Trophy,
  alerts: AlertTriangle,
  kpiForm: ClipboardList,
  recommendations: Lightbulb,
};

const moduleLabels = {
  users: 'User Management',
  hospitals: 'Hospital Management',
  clinicalAI: 'Clinical AI & Decision Support',
  workforceManagement: 'Workforce Management',
  supplyChain: 'Supply Chain Intelligence',
  patientFlow: 'Patient Flow & Bed Management',
  financialPerformance: 'Financial Performance & Revenue',
  leaderboard: 'Performance Leaderboard',
  alerts: 'Alerts & Notifications',
  kpiForm: 'KPI Form Submission',
  recommendations: 'AI Recommendations',
};

export function UserSettingsModal({ isOpen, onClose }: UserSettingsModalProps) {
  const { user } = useAuthStore();
  const { settings, updateSettings, toggleModule, resetSettings, exportSettings, importSettings } = useSettingsStore();
  const { showSuccess, showError, showInfo } = useToast();
  const [activeTab, setActiveTab] = useState<'modules' | 'preferences' | 'notifications' | 'import-export'>('modules');
  const [importText, setImportText] = useState('');

  if (!isOpen || !settings || !user) return null;

  const handleSaveSettings = () => {
    showSuccess('Settings Saved', 'Your preferences have been saved successfully');
    onClose();
  };

  const handleResetSettings = () => {
    resetSettings();
    showInfo('Settings Reset', 'All settings have been reset to defaults');
  };

  const handleExportSettings = () => {
    const settingsJson = exportSettings();
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kpi-hospital-settings-${user.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess('Settings Exported', 'Settings have been downloaded as a JSON file');
  };

  const handleImportSettings = () => {
    if (!importText.trim()) {
      showError('Import Failed', 'Please paste valid settings JSON');
      return;
    }

    const success = importSettings(importText);
    if (success) {
      showSuccess('Settings Imported', 'Settings have been imported successfully');
      setImportText('');
    } else {
      showError('Import Failed', 'Invalid settings format or corrupted data');
    }
  };

  const getModulesForRole = () => {
    const allModules = Object.keys(settings.dashboardModules) as (keyof UserSettings['dashboardModules'])[];
    
    // Filter modules based on user role
    switch (user.role) {
      case 'admin':
        return allModules;
      case 'director':
        return allModules.filter(module => 
          !['users', 'hospitals'].includes(module)
        );
      case 'manager':
        return allModules.filter(module => 
          !['users', 'hospitals', 'leaderboard', 'alerts'].includes(module)
        );
      default:
        return [];
    }
  };

  const availableModules = getModulesForRole();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">User Settings</h2>
              <p className="text-sm text-gray-500">Customize your dashboard and preferences</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('modules')}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left ${
                  activeTab === 'modules' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>Dashboard Modules</span>
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left ${
                  activeTab === 'preferences' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Preferences</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left ${
                  activeTab === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab('import-export')}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left ${
                  activeTab === 'import-export' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Download className="h-4 w-4" />
                <span>Import/Export</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'modules' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Modules</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enable or disable specific modules in your sidebar and dashboard. Disabled modules will be hidden from view.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableModules.map((module) => {
                    const IconComponent = moduleIcons[module];
                    const isEnabled = settings.dashboardModules[module];
                    
                    return (
                      <Card key={module} className={`cursor-pointer transition-all ${
                        isEnabled ? 'ring-2 ring-blue-200 bg-blue-50' : 'hover:shadow-md'
                      }`} onClick={() => toggleModule(module)}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <IconComponent className={`h-5 w-5 ${
                                isEnabled ? 'text-blue-600' : 'text-gray-400'
                              }`} />
                              <div>
                                <h4 className={`font-medium ${
                                  isEnabled ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                  {moduleLabels[module]}
                                </h4>
                                <p className={`text-sm ${
                                  isEnabled ? 'text-blue-600' : 'text-gray-500'
                                }`}>
                                  {isEnabled ? 'Enabled' : 'Disabled'}
                                </p>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isEnabled ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                            }`}>
                              {isEnabled && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Quick Actions</p>
                    <p className="text-sm text-gray-600">Manage all modules at once</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const allEnabled = { ...settings.dashboardModules };
                        availableModules.forEach(module => {
                          allEnabled[module] = true;
                        });
                        updateSettings({ dashboardModules: allEnabled });
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Enable All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const allDisabled = { ...settings.dashboardModules };
                        availableModules.forEach(module => {
                          allDisabled[module] = false;
                        });
                        updateSettings({ dashboardModules: allDisabled });
                      }}
                    >
                      <EyeOff className="h-4 w-4 mr-2" />
                      Disable All
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">General Preferences</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Customize your general application preferences and interface settings.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="h-5 w-5" />
                      <span>Appearance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => updateSettings({ theme: 'light' })}
                          className={`px-4 py-2 rounded-lg border-2 ${
                            settings.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          Light
                        </button>
                        <button
                          onClick={() => updateSettings({ theme: 'dark' })}
                          className={`px-4 py-2 rounded-lg border-2 ${
                            settings.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          Dark
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Format
                      </label>
                      <select
                        value={settings.dateFormat}
                        onChange={(e) => updateSettings({ dateFormat: e.target.value as UserSettings['dateFormat'] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => updateSettings({ timezone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notification Settings</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Control how and when you receive notifications about important events.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive alerts and updates via email</p>
                      </div>
                      <button
                        onClick={() => updateSettings({
                          notifications: {
                            ...settings.notifications,
                            email: !settings.notifications.email
                          }
                        })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications.email ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Browser push notifications for urgent alerts</p>
                      </div>
                      <button
                        onClick={() => updateSettings({
                          notifications: {
                            ...settings.notifications,
                            push: !settings.notifications.push
                          }
                        })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications.push ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">In-App Notifications</h4>
                        <p className="text-sm text-gray-600">Show notification badges and alerts within the app</p>
                      </div>
                      <button
                        onClick={() => updateSettings({
                          notifications: {
                            ...settings.notifications,
                            inApp: !settings.notifications.inApp
                          }
                        })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications.inApp ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.notifications.inApp ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'import-export' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Import/Export Settings</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Backup your settings or transfer them between devices.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Download className="h-5 w-5" />
                        <span>Export Settings</span>
                      </CardTitle>
                      <CardDescription>
                        Download your current settings as a JSON file
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={handleExportSettings} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export Settings
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Upload className="h-5 w-5" />
                        <span>Import Settings</span>
                      </CardTitle>
                      <CardDescription>
                        Restore settings from a previously exported file
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <textarea
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                        placeholder="Paste your settings JSON here..."
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button onClick={handleImportSettings} className="w-full" disabled={!importText.trim()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-600">
                      <RotateCcw className="h-5 w-5" />
                      <span>Reset Settings</span>
                    </CardTitle>
                    <CardDescription>
                      Reset all settings to their default values
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" onClick={handleResetSettings}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset to Defaults
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Settings are automatically saved as you make changes
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save & Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}