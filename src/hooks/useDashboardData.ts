
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TaxLead } from '@/types/taxLead';
import { Activity } from '@/types/activity';

export interface DashboardStats {
  totalLeads: number;
  hotDeals: number;
  warmDeals: number;
  coldDeals: number;
  passRate: number;
  keepRate: number;
  thisWeekLeads: number;
  thisMonthLeads: number;
  avgResponseTime: string;
}

export interface DashboardDataContextType {
  leads: TaxLead[];
  stats: DashboardStats;
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardData(): DashboardDataContextType {
  const { data: leads = [], isLoading, error, refetch } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Loaded leads from database:', data?.length || 0, 'leads');
      return data || [];
    },
  });

  const stats: DashboardStats = {
    totalLeads: leads.length,
    hotDeals: leads.filter(lead => lead.status === 'HOT').length,
    warmDeals: leads.filter(lead => lead.status === 'WARM').length,
    coldDeals: leads.filter(lead => lead.status === 'COLD').length,
    passRate: leads.filter(lead => lead.disposition === 'DISQUALIFIED').length,
    keepRate: leads.filter(lead => lead.disposition === 'QUALIFIED').length,
    thisWeekLeads: leads.filter(lead => {
      const leadDate = new Date(lead.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return leadDate >= weekAgo;
    }).length,
    thisMonthLeads: leads.filter(lead => {
      const leadDate = new Date(lead.created_at);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return leadDate >= monthAgo;
    }).length,
    avgResponseTime: '2.5 hrs'
  };

  const activities: Activity[] = leads.slice(0, 5).map((lead, index) => ({
    id: `activity-${index}`,
    type: 'lead_created',
    title: `New lead: ${lead.ownerName}`,
    description: `Lead created for ${lead.propertyAddress}`,
    timestamp: lead.created_at,
    user: 'System'
  }));

  return {
    leads,
    stats,
    activities,
    loading: isLoading,
    error: error?.message || null,
    refetch
  };
}
