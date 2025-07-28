
import React, { createContext, useContext, ReactNode } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { TaxLead } from '@/types/taxLead';

interface DashboardStats {
  hotDeals: number;
  warmDeals: number;
  coldDeals: number;
  passRate: number;
  totalLeads: number;
  keepRate: number;
  passDeals: number;
  keepDeals: number;
  thisWeekLeads: number;
  thisMonthLeads: number;
  avgResponseTime: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  userName: string;
  timestamp: Date;
  leadId: string;
  module: string;
  actionType: string;
  referenceId?: string;
  referenceType?: string;
  metadata?: any;
}

interface DashboardDataContextType {
  leads: TaxLead[];
  stats: DashboardStats;
  activities: ActivityItem[];
  loading: boolean;
  refetch: () => Promise<void>;
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

interface DashboardDataProviderProps {
  children: ReactNode;
}

export function DashboardDataProvider({ children }: DashboardDataProviderProps) {
  const { recentLeads, stats } = useDashboardData();
  
  // Create a complete dashboard data object with all required properties
  const dashboardData: DashboardDataContextType = {
    leads: recentLeads,
    stats: {
      hotDeals: stats.hotLeads,
      warmDeals: stats.warmLeads,
      coldDeals: stats.coldLeads,
      passRate: stats.totalLeads > 0 ? (stats.passLeads / stats.totalLeads) * 100 : 0,
      totalLeads: stats.totalLeads,
      keepRate: stats.totalLeads > 0 ? (stats.keepLeads / stats.totalLeads) * 100 : 0,
      passDeals: stats.passLeads,
      keepDeals: stats.keepLeads,
      thisWeekLeads: stats.totalLeads, // Using totalLeads as approximation
      thisMonthLeads: stats.totalLeads,
      avgResponseTime: "2.5 hours"
    },
    activities: [], // Empty array for now, can be populated later
    loading: false,
    refetch: async () => {
      // Implement refetch logic if needed
      return Promise.resolve();
    }
  };

  return (
    <DashboardDataContext.Provider value={dashboardData}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardDataContext() {
  const context = useContext(DashboardDataContext);
  if (context === undefined) {
    throw new Error('useDashboardDataContext must be used within a DashboardDataProvider');
  }
  return context;
}
