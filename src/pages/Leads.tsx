
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { EnhancedLeadsContent } from '@/components/leads/EnhancedLeadsContent';

const Leads = () => {
  return (
    <div className="min-h-screen bg-white">
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full">
          {/* Conditionally render sidebar - hide it for leads page */}
          <div className="hidden">
            <AppSidebar />
          </div>
          {/* Full width content for leads */}
          <div className="flex-1 w-full">
            <EnhancedLeadsContent />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Leads;
