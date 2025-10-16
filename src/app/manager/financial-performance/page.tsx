'use client';

import { withAuth } from '@/hooks/use-auth';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { FinancialPerformance } from '@/components/financial/financial-performance';

function ManagerFinancialPerformancePage() {
  return (
    <DashboardLayout>
      <FinancialPerformance />
    </DashboardLayout>
  );
}

export default withAuth(ManagerFinancialPerformancePage, { requiredRole: 'manager' });