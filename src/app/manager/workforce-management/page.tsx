'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { WorkforceManagement } from '@/components/workforce/workforce-management';
import { withAuth } from '@/hooks/use-auth';

function ManagerWorkforceManagementPage() {
  return (
    <DashboardLayout>
      <WorkforceManagement />
    </DashboardLayout>
  );
}

export default withAuth(ManagerWorkforceManagementPage, { requiredRole: 'manager' });