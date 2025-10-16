'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SupplyChainIntelligence } from '@/components/supply-chain/supply-chain-intelligence';
import { withAuth } from '@/hooks/use-auth';

function AdminSupplyChainIntelligencePage() {
  return (
    <DashboardLayout>
      <SupplyChainIntelligence />
    </DashboardLayout>
  );
}

export default withAuth(AdminSupplyChainIntelligencePage, { requiredRole: 'admin' });