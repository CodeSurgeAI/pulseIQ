"use client";

import React from 'react';
import { AlertProvider } from '@/components/ui/alert-dialog';
import { ToastProvider } from '@/components/ui/toast';
import { SettingsInitializer } from '@/components/layout/settings-initializer';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <AlertProvider>
      <ToastProvider>
        <SettingsInitializer>
          {children}
        </SettingsInitializer>
      </ToastProvider>
    </AlertProvider>
  );
};