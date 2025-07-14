import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardStats } from './DashboardStats';
import { ActivityFeed } from './ActivityFeed';
import { LeadsPieChart } from './LeadsPieChart';
import { BarChart3, Activity, TrendingUp, Users, Target, Award } from 'lucide-react';
import { useDashboardDataContext } from '@/contexts/DashboardDataContext';

interface DashboardContentProps {
  userRole: string;
  showLeadsInDashboard?: boolean;
}

export function DashboardContent({ userRole, showLeadsInDashboard = false }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { stats, loading } = useDashboardDataContext();

  const renderTabContent = (tabType: 'hot' | 'warm' | 'cold' | 'pass') => {
    const configs = {
      hot: {
        title: 'Hot Deals - Ready to Close',
        subtitle: `${stats.hotDeals} deals ready for closing`,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: TrendingUp
      },
      warm: {
        title: 'Warm Deals - In Progress',
        subtitle: `${stats.warmDeals} deals currently in progress`,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        icon: Users
      },
      cold: {
        title: 'Cold Deals - Need Attention',
        subtitle: `${stats.coldDeals} deals requiring follow-up`,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        icon: Target
      },
      pass: {
        title: 'Pass Rate Statistics',
        subtitle: `${stats.passRate}% pass rate from ${stats.totalLeads} total leads`,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        icon: Award
      }
    };

    const config = configs[tabType];
    const IconComponent = config.icon;

    return (
      <div className="space-y-6">
        <DashboardStats userRole={userRole} />
        <div className={`text-center py-12 rounded-lg ${config.bgColor} border-2 border-dashed border-gray-200`}>
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center`}>
              <IconComponent className={`w-8 h-8 ${config.color}`} />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${config.color} mb-2`}>
                {config.title}
              </h3>
              <p className="text-gray-600 text-lg">
                {loading ? 'Loading...' : config.subtitle}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeadsPieChart />
          <ActivityFeed userRole={userRole} />
        </div>
      </div>
    );
  };

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
            {renderTabContent('hot')}
          </TabsContent>

          <TabsContent value="warm-deals" className="space-y-6">
            {renderTabContent('warm')}
          </TabsContent>

          <TabsContent value="cold-deals" className="space-y-6">
            {renderTabContent('cold')}
          </TabsContent>

          <TabsContent value="pass-rate" className="space-y-6">
            {renderTabContent('pass')}
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ActivityFeed userRole={userRole} />
          </TabsContent>
        </Tabs>
      </main>
    </SidebarInset>
  );
}
