'use client';

import { withAuth } from '@/hooks/use-auth';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PatientFlowManagement } from '@/components/patient-flow/patient-flow-management';

function DirectorPatientFlowPage() {
  return (
    <DashboardLayout>
      <PatientFlowManagement />
    </DashboardLayout>
  );
}

export default withAuth(DirectorPatientFlowPage, { requiredRole: 'director' });