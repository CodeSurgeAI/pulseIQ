'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { WorkforceManagement } from '@/components/workforce/workforce-management';
import { withAuth } from '@/hooks/use-auth';

function DirectorWorkforceManagementPage() {
  return (
    <DashboardLayout>
      <WorkforceManagement />
    </DashboardLayout>
  );
}

export default withAuth(DirectorWorkforceManagementPage, { requiredRole: 'director' });