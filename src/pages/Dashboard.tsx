
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-crm-bg">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <DashboardContent />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
