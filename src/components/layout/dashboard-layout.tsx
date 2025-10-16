'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { TopNav } from '@/components/layout/topnav';
import { Footer } from '@/components/layout/footer';
import { ClientLayout } from '@/components/layout/client-layout';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopNav title={title} />
            <main className="flex-1 p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </ClientLayout>
  );
}