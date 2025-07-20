
import { useMemo } from 'react';
import { TaxLead } from '@/types/taxLead';
import { mockTaxLeads } from '@/data/mockTaxLeads';

interface DashboardStats {
  hotDeals: number;
  warmDeals: number;
  coldDeals: number;
  passRate: number;
  totalLeads: number;
  keepRate: number;
  passDeals: number;
  keepDeals: number;
}

interface ActivityItem {
  id: string;
  type: 'lead_created' | 'lead_updated' | 'note_added' | 'status_changed';
  description: string;
  userName: string;
  timestamp: Date;
  leadId: string;
}

export interface DashboardDataContextType {
  leads: TaxLead[];
  stats: DashboardStats;
  activities: ActivityItem[];
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useDashboardData(): DashboardDataContextType {
  const leads = mockTaxLeads;
  
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const hotDeals = leads.filter(lead => lead.status === 'HOT').length;
    const warmDeals = leads.filter(lead => lead.status === 'WARM').length;
    const coldDeals = leads.filter(lead => lead.status === 'COLD').length;
    const passDeals = leads.filter(lead => lead.disposition === 'PASS').length;
    const keepDeals = leads.filter(lead => lead.disposition === 'KEEP').length;
    
    const passRate = totalLeads > 0 ? Math.round((passDeals / totalLeads) * 100) : 0;
    const keepRate = totalLeads > 0 ? Math.round((keepDeals / totalLeads) * 100) : 0;

    return {
      totalLeads,
      hotDeals,
      warmDeals,
      coldDeals,
      passDeals,
      keepDeals,
      passRate,
      keepRate
    };
  }, [leads]);

  const activities = useMemo(() => [
    {
      id: '1',
      type: 'lead_created' as const,
      description: 'New hot lead added - John Smith property on Main St',
      userName: 'Sarah Johnson',
      timestamp: new Date(),
      leadId: '1'
    },
    {
      id: '2',
      type: 'status_changed' as const,
      description: 'Lead temperature updated from COLD to WARM',
      userName: 'Mike Davis',
      timestamp: new Date(Date.now() - 3600000),
      leadId: '2'
    },
    {
      id: '3',
      type: 'note_added' as const,
      description: 'Follow-up call scheduled for tomorrow',
      userName: 'Emma Wilson',
      timestamp: new Date(Date.now() - 7200000),
      leadId: '3'
    },
    {
      id: '4',
      type: 'lead_updated' as const,
      description: 'Contact information verified and updated',
      userName: 'Alex Thompson',
      timestamp: new Date(Date.now() - 10800000),
      leadId: '4'
    },
    {
      id: '5',
      type: 'lead_created' as const,
      description: 'Property details updated with latest tax records',
      userName: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 14400000),
      leadId: '5'
    },
    {
      id: '6',
      type: 'status_changed' as const,
      description: 'Lead marked as qualified after assessment',
      userName: 'Mike Davis',
      timestamp: new Date(Date.now() - 18000000),
      leadId: '6'
    },
    {
      id: '7',
      type: 'note_added' as const,
      description: 'Email campaign response received',
      userName: 'Emma Wilson',
      timestamp: new Date(Date.now() - 21600000),
      leadId: '7'
    },
    {
      id: '8',
      type: 'lead_updated' as const,
      description: 'Lead qualification process completed',
      userName: 'Alex Thompson',
      timestamp: new Date(Date.now() - 25200000),
      leadId: '8'
    },
    {
      id: '9',
      type: 'lead_created' as const,
      description: 'Appointment scheduled with property owner',
      userName: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 28800000),
      leadId: '9'
    },
    {
      id: '10',
      type: 'note_added' as const,
      description: 'Document uploaded to lead profile',
      userName: 'Mike Davis',
      timestamp: new Date(Date.now() - 32400000),
      leadId: '10'
    }
  ], []);

  const refetch = async () => {
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
