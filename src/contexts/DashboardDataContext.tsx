
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
  const dashboardData = useDashboardData();

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
