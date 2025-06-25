
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

const Dashboard = () => {
  const [userRole, setUserRole] = useState('Employee');

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('userRole') || 'Employee';
    setUserRole(role);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <DashboardContent userRole={userRole} />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
