'use client';

import { withAuth } from '@/hooks/use-auth';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { FinancialPerformance } from '@/components/financial/financial-performance';

function AdminFinancialPerformancePage() {
  return (
    <DashboardLayout>
      <FinancialPerformance />
    </DashboardLayout>
  );
}

export default withAuth(AdminFinancialPerformancePage, { requiredRole: 'admin' });