'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/context/settings-store';
import { useAuthStore } from '@/context/auth-store';

interface SettingsInitializerProps {
  children: React.ReactNode;
}

export function SettingsInitializer({ children }: SettingsInitializerProps) {
  const { initializeSettings } = useSettingsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Initialize settings when user is loaded
    if (user) {
      initializeSettings(user.id);
    }
  }, [user, initializeSettings]);

  return <>{children}</>;
}