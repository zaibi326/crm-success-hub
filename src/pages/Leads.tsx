
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { EnhancedLeadsContent } from '@/components/leads/EnhancedLeadsContent';

const Leads = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <EnhancedLeadsContent />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Leads;
