
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { IntegratedLeadManagement } from '@/components/leads/IntegratedLeadManagement';

const Leads = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <IntegratedLeadManagement />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Leads;
