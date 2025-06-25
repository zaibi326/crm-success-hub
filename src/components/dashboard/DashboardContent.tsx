
import React from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardStats } from './DashboardStats';
import { LeadsPieChart } from './LeadsPieChart';
import { ActivityFeed } from './ActivityFeed';
import { Badge } from '@/components/ui/badge';
import { getRoleDashboardTitle } from '@/utils/roleRedirect';

interface DashboardContentProps {
  userRole: string;
}

export function DashboardContent({ userRole }: DashboardContentProps) {
  const dashboardTitle = getRoleDashboardTitle(userRole);
  
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'employee':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <SidebarInset className="flex-1 overflow-auto bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{dashboardTitle}</h1>
              <Badge className={getRoleBadgeColor(userRole)}>
                {userRole}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">
              Welcome back! Here's your {userRole.toLowerCase()} overview for today.
            </p>
          </div>
        </div>
      </header>
      
      <main className="p-6 space-y-8">
        <div className="animate-fade-in-up">
          <DashboardStats userRole={userRole} />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-slide-in-right">
          <div className="space-y-8">
            <LeadsPieChart />
          </div>
          <div className="space-y-8">
            <ActivityFeed userRole={userRole} />
          </div>
        </div>
      </main>
    </SidebarInset>
  );
}
