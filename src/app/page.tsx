'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/context/auth-store';
import { configService } from '@/utils/config';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication (auto-login if disabled)
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isLoading) return;

    // If login is disabled, always redirect to admin dashboard
    if (!configService.isLoginEnabled) {
      router.push('/admin/dashboard');
      return;
    }

    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

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
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Hospital KPI Management Platform...</p>
        </div>
      </div>
    );
  }

  return null;
}
