'use client';

import { withAuth } from '@/hooks/use-auth';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PatientFlowManagement } from '@/components/patient-flow/patient-flow-management';

function ManagerPatientFlowPage() {
  return (
    <DashboardLayout>
      <PatientFlowManagement />
    </DashboardLayout>
  );
}

export default withAuth(ManagerPatientFlowPage, { requiredRole: 'manager' });