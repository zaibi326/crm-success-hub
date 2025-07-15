
import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardStats } from './DashboardStats';
import { ActivityFeed } from './ActivityFeed';
import { LeadsPieChart } from './LeadsPieChart';
import { BarChart3, Activity } from 'lucide-react';
import { useDashboardDataContext } from '@/contexts/DashboardDataContext';

interface DashboardContentProps {
  userRole: string;
  showLeadsInDashboard?: boolean;
}

export function DashboardContent({ userRole, showLeadsInDashboard = false }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { stats, loading } = useDashboardDataContext();

  return (
    <SidebarInset className="flex-1 overflow-auto">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
        </div>
      </header>

      <main className="p-6 bg-gradient-to-br from-gray-50/30 to-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardStats userRole={userRole} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LeadsPieChart />
              <ActivityFeed userRole={userRole} />
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ActivityFeed userRole={userRole} />
          </TabsContent>
        </Tabs>
      </main>
    </SidebarInset>
  );
}
