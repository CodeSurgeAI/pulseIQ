'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ClinicalDecisionSupport } from '@/components/ai/clinical-decision-support';
import { withAuth } from '@/hooks/use-auth';

function AdminClinicalDecisionSupportPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ClinicalDecisionSupport />
      </div>
    </DashboardLayout>
  );
}

export default withAuth(AdminClinicalDecisionSupportPage, { requiredRole: 'admin' });