
import { useMemo } from 'react';
import { TaxLead } from '@/types/taxLead';
import { mockTaxLeads } from '@/data/mockTaxLeads';

export interface DashboardDataContextType {
  leads: TaxLead[];
  stats: {
    totalLeads: number;
    hotLeads: number;
    warmLeads: number;
    coldLeads: number;
    qualifiedLeads: number;
    thisWeekLeads: number;
    thisMonthLeads: number;
    avgResponseTime: string;
  };
  activities: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
    leadId?: number;
  }>;
  loading: boolean;
  refetch: () => void;
}

export function useDashboardData(): DashboardDataContextType {
  const leads = mockTaxLeads;
  
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const hotLeads = leads.filter(lead => lead.status === 'HOT').length;
    const warmLeads = leads.filter(lead => lead.status === 'WARM').length;
    const coldLeads = leads.filter(lead => lead.status === 'COLD').length;
    const qualifiedLeads = leads.filter(lead => lead.disposition === 'QUALIFIED').length;
    
    // Calculate leads from this week and month
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const thisWeekLeads = leads.filter(lead => 
      new Date(lead.createdAt) >= oneWeekAgo
    ).length;
    
    const thisMonthLeads = leads.filter(lead => 
      new Date(lead.createdAt) >= oneMonthAgo
    ).length;

    return {
      totalLeads,
      hotLeads,
      warmLeads,
      coldLeads,
      qualifiedLeads,
      thisWeekLeads,
      thisMonthLeads,
      avgResponseTime: '2.4 hours'
    };
  }, [leads]);

  const activities = useMemo(() => [
    {
      id: '1',
      type: 'HOT',
      message: 'New hot lead added',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'WARM',
      message: 'Lead temperature updated',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      type: 'COLD',
      message: 'Follow-up scheduled',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '4',
      type: 'PASS',
      message: 'Lead marked as pass',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: '5',
      type: 'HOT',
      message: 'Property details updated',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: '6',
      type: 'WARM',
      message: 'Contact information verified',
      timestamp: new Date(Date.now() - 18000000).toISOString(),
    },
    {
      id: '7',
      type: 'COLD',
      message: 'Email campaign sent',
      timestamp: new Date(Date.now() - 21600000).toISOString(),
    },
    {
      id: '8',
      type: 'PASS',
      message: 'Lead qualification completed',
      timestamp: new Date(Date.now() - 25200000).toISOString(),
    },
    {
      id: '9',
      type: 'HOT',
      message: 'Appointment scheduled',
      timestamp: new Date(Date.now() - 28800000).toISOString(),
    },
    {
      id: '10',
      type: 'WARM',
      message: 'Document uploaded',
      timestamp: new Date(Date.now() - 32400000).toISOString(),
    }
  ], []);

  const refetch = () => {
    // In a real app, this would refetch data from the API
    console.log('Refetching dashboard data...');
  };

  return {
    leads,
    stats,
    activities,
    loading: false,
    refetch
  };
}

export function getLeadsByDisposition() {
  const leads = mockTaxLeads;
  const total = leads.length;
  
  const dispositionCounts = leads.reduce((acc, lead) => {
    const disposition = lead.disposition || 'UNDECIDED';
    acc[disposition] = (acc[disposition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(dispositionCounts).map(([disposition, count]) => ({
    disposition,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0
  }));
}

export function getQualifiedLeads() {
  return mockTaxLeads.filter(lead => lead.disposition === 'QUALIFIED');
}
