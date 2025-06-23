
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { CampaignsContent } from '@/components/campaigns/CampaignsContent';

const Campaigns = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <CampaignsContent />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Campaigns;
