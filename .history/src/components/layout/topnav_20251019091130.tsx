'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, LogOut, Settings, User, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserSettingsModal } from '@/components/ui/user-settings-modal';
import { cn } from '@/utils';
import { useAuthStore } from '@/context/auth-store';
import { usePermissions } from '@/hooks/use-auth';
import { mockAlerts } from '@/utils/mock-data';
import { configService } from '@/utils/config';
import { KpiAssistant } from '@/components/ai/kpi-assistant';

interface TopNavProps {
  title?: string;
  className?: string;
}

export function TopNav({ title, className }: TopNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [alerts, setAlerts] = useState(mockAlerts);
  
  const searchRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const { logout } = useAuthStore();
  const { user } = usePermissions();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      alert(`Searching for: ${searchQuery}`);
    }
  };

  // Notification actions
  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  };

  // Profile actions
  const handleLogout = () => {
    if (!configService.isLoginEnabled) {
      alert('Logout is disabled in demo mode');
      return;
    }
    logout();
    router.push('/login');
  };

  const viewProfile = () => {
    setShowProfileMenu(false);
    alert('Profile page coming soon!');
  };

  const openSettings = () => {
    setShowProfileMenu(false);
    setShowSettings(true);
  };

  if (!user) return null;

  const unreadAlertsCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <>
      <header
        className={cn(
          "bg-white border-b border-gray-200 px-6 py-4",
          className
        )}
      >
        <div className="flex items-center justify-between">
          {/* Left side - Title */}
          <div className="flex-1">
            {title && (
              <h1 className="text-2xl font-semibold text-gray-900">
                {title}
              </h1>
            )}
          </div>

          {/* Right side - Search, Assistant, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search users, hospitals, KPIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </form>

            {/* KPI Assistant */}
            <KpiAssistant />

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadAlertsCount}
                  </span>
                )}
              </Button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadAlertsCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {alerts.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      alerts.slice(0, 8).map((alert) => (
                        <div
                          key={alert.id}
                          className={cn(
                            "p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors",
                            !alert.isRead && "bg-blue-50"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <div className={cn(
                                  "w-2 h-2 rounded-full flex-shrink-0",
                                  {
                                    'bg-red-500': alert.severity === 'critical',
                                    'bg-yellow-500': alert.severity === 'medium',
                                    'bg-blue-500': alert.severity === 'low',
                                  }
                                )} />
                                <p className="font-medium text-gray-900 truncate">
                                  {alert.title}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {alert.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(alert.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              {!alert.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(alert.id)}
                                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                  title="Mark as read"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => dismissAlert(alert.id)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                title="Dismiss"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {alerts.length > 8 && (
                    <div className="p-4 border-t border-gray-200 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNotifications(false)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View all notifications
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="hidden md:block text-gray-700">{user.name}</span>
              </Button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{user.role}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={viewProfile}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-left"
                    >
                      <User className="h-4 w-4" />
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={openSettings}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-left"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <UserSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}