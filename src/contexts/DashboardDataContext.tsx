
import React, { createContext, useContext, ReactNode } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { TaxLead } from '@/types/taxLead';

interface DashboardStats {
  hotDeals: number;
  warmDeals: number;
  coldDeals: number;
  passRate: number;
  totalLeads: number;
}

interface ActivityItem {
  id: string;
  type: 'lead_created' | 'lead_updated' | 'note_added' | 'status_changed';
  description: string;
  userName: string;
  timestamp: Date;
  leadId: string;
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
