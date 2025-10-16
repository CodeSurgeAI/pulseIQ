'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/context/auth-store';
import { configService } from '@/utils/config';
import { UserRole } from '@/types';

interface WithAuthOptions {
  requiredRole?: UserRole;
  redirectTo?: string;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { requiredRole, redirectTo = '/login' } = options;

  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, initializeAuth } = useAuthStore();

    useEffect(() => {
      // Initialize authentication (auto-login if disabled)
      initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
      if (isLoading) return;

      // If login is disabled, skip authentication checks
      if (!configService.isLoginEnabled) {
        return;
      }

      if (!isAuthenticated || !user) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        // Redirect based on user role
        switch (user.role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'director':
            router.push('/director/dashboard');
            break;
          case 'manager':
            router.push('/manager/dashboard');
            break;
          default:
            router.push('/login');
        }
        return;
      }
    }, [user, isAuthenticated, isLoading, router, initializeAuth]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    // If login is disabled, always allow access
    if (!configService.isLoginEnabled) {
      return <Component {...props} />;
    }

    if (!isAuthenticated || !user) {
      return null;
    }

    if (requiredRole && user.role !== requiredRole) {
      return null;
    }

    return <Component {...props} />;
  };
}

// Hook for checking permissions
export function usePermissions() {
  const { user } = useAuthStore();

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const canAccessRoute = (route: string): boolean => {
    if (!user) return false;

    // Route-based permissions
    const routePermissions: Record<string, UserRole[]> = {
      '/admin': ['admin'],
      '/director': ['admin', 'director'],
      '/manager': ['admin', 'director', 'manager'],
    };

    const requiredRoles = routePermissions[route.split('/').slice(0, 2).join('/')];
    return requiredRoles ? hasAnyRole(requiredRoles) : true;
  };

  return {
    user,
    hasRole,
    hasAnyRole,
    canAccessRoute,
    isAdmin: hasRole('admin'),
    isDirector: hasRole('director'),
    isManager: hasRole('manager'),
  };
}