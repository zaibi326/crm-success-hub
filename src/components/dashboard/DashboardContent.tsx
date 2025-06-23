
import React from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardStats } from './DashboardStats';
import { LeadsPieChart } from './LeadsPieChart';
import { ActivityFeed } from './ActivityFeed';

export function DashboardContent() {
  return (
    <SidebarInset className="flex-1 overflow-auto">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      
      <main className="p-6 space-y-6">
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeadsPieChart />
          <ActivityFeed />
        </div>
      </main>
    </SidebarInset>
  );
}
