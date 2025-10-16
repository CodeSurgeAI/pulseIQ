'use client';

import { withAuth } from '@/hooks/use-auth';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { FinancialPerformance } from '@/components/financial/financial-performance';

function DirectorFinancialPerformancePage() {
  return (
    <DashboardLayout>
      <FinancialPerformance />
    </DashboardLayout>
  );
}

export default withAuth(DirectorFinancialPerformancePage, { requiredRole: 'director' });