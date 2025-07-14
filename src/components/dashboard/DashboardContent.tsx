
import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardStats } from './DashboardStats';
import { ActivityFeed } from './ActivityFeed';
import { LeadsPieChart } from './LeadsPieChart';
import { BarChart3, Activity, TrendingUp, Users, Target, Award } from 'lucide-react';

interface DashboardContentProps {
  userRole: string;
  showLeadsInDashboard?: boolean;
}

export function DashboardContent({ userRole, showLeadsInDashboard = false }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState('overview');

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
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="hot-deals" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Hot Deals
            </TabsTrigger>
            <TabsTrigger value="warm-deals" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Warm Deals
            </TabsTrigger>
            <TabsTrigger value="cold-deals" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Cold Deals
            </TabsTrigger>
            <TabsTrigger value="pass-rate" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Pass Rate
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

          <TabsContent value="hot-deals" className="space-y-6">
            <DashboardStats userRole={userRole} />
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold text-red-600 mb-2">Hot Deals - Ready to Close</h3>
              <p className="text-gray-600">45 deals ready for closing</p>
            </div>
          </TabsContent>

          <TabsContent value="warm-deals" className="space-y-6">
            <DashboardStats userRole={userRole} />
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold text-yellow-600 mb-2">Warm Deals - In Progress</h3>
              <p className="text-gray-600">78 deals currently in progress</p>
            </div>
          </TabsContent>

          <TabsContent value="cold-deals" className="space-y-6">
            <DashboardStats userRole={userRole} />
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Cold Deals - Need Attention</h3>
              <p className="text-gray-600">123 deals requiring follow-up</p>
            </div>
          </TabsContent>

          <TabsContent value="pass-rate" className="space-y-6">
            <DashboardStats userRole={userRole} />
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold text-green-600 mb-2">Pass Rate - 12%</h3>
              <p className="text-gray-600">34 of 280 leads converted successfully</p>
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
