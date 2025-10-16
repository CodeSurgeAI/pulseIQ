'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/context/auth-store';
import { useSettingsStore } from '@/context/settings-store';
import { UserSettings } from '@/types/settings';

interface withModuleAccessOptions {
  requiredRole?: 'admin' | 'director' | 'manager';
  requiredModule?: keyof UserSettings['dashboardModules'];
  fallbackUrl?: string;
}

export function withModuleAccess<T extends object>(
  Component: React.ComponentType<T>,
  options: withModuleAccessOptions = {}
) {
  const { requiredRole, requiredModule, fallbackUrl = '/dashboard' } = options;

  return function ProtectedComponent(props: T) {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const { settings } = useSettingsStore();

    useEffect(() => {
      // Check authentication
      if (!isAuthenticated || !user) {
        router.push('/login');
        return;
      }

      // Check role-based access
      if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
        router.push(fallbackUrl);
        return;
      }

      // Check module-based access
      if (requiredModule && settings?.dashboardModules) {
        if (!settings.dashboardModules[requiredModule]) {
          router.push(fallbackUrl);
          return;
        }
      }
    }, [user, settings, router, isAuthenticated]);

    // Show loading or nothing while checking access
    if (!isAuthenticated || !user || !settings) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    // Check role access
    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
      return null;
    }

    // Check module access
    if (requiredModule && settings.dashboardModules && !settings.dashboardModules[requiredModule]) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Module Not Available</h2>
            <p className="text-gray-600 mb-4">This module has been disabled in your settings.</p>
            <button
              onClick={() => router.push(fallbackUrl)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}