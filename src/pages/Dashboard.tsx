
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { DashboardDataProvider } from '@/contexts/DashboardDataContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';

const Dashboard = () => {
  const { userRole } = useRoleAccess();

  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <DashboardDataProvider>
            <DashboardContent userRole={userRole} />
          </DashboardDataProvider>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
