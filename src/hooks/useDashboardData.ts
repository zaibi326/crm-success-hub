
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TaxLead } from '@/types/taxLead';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardStats {
  totalLeads: number;
  hotDeals: number;
  warmDeals: number;
  coldDeals: number;
  passRate: number;
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

export interface DashboardDataContextType {
  leads: TaxLead[];
  stats: DashboardStats;
  activities: ActivityItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboardData(): DashboardDataContextType {
  const { user, isLoading: authLoading } = useAuth();

  const { data: campaignLeads = [], isLoading: leadsLoading, error: leadsError, refetch: refetchLeads } = useQuery({
    queryKey: ['campaign-leads'],
    queryFn: async () => {
      // Don't fetch if user is not authenticated or still loading
      if (!user?.id || authLoading) {
        return [];
      }

      const { data, error } = await supabase
        .from('campaign_leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Loaded campaign leads from database:', data?.length || 0, 'leads');
      return data || [];
    },
    enabled: !!user?.id && !authLoading,
  });

  const { data: activitiesData = [], isLoading: activitiesLoading, error: activitiesError, refetch: refetchActivities } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      // Don't fetch if user is not authenticated or still loading
      if (!user?.id || authLoading) {
        return [];
      }

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      console.log('Loaded activities from database:', data?.length || 0, 'activities');
      return data || [];
    },
    enabled: !!user?.id && !authLoading,
  });

  // Set up real-time subscription for activities
  useEffect(() => {
    // Don't set up subscription if user is not authenticated
    if (!user?.id || authLoading) {
      return;
    }

    const channel = supabase
      .channel('activities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities'
        },
        (payload) => {
          console.log('Real-time activity update:', payload);
          refetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchActivities, user?.id, authLoading]);

  // Transform campaign_leads to TaxLead format
  const leads: TaxLead[] = campaignLeads.map(lead => ({
    id: parseInt(lead.id) || 0,
    taxId: lead.tax_id || '',
    ownerName: lead.owner_name,
    propertyAddress: lead.property_address,
    currentArrears: lead.current_arrears || undefined,
    status: (lead.status as 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP') || 'COLD',
    email: lead.email || undefined,
    phone: lead.phone || undefined,
    taxLawsuitNumber: lead.tax_lawsuit_number || undefined,
    notes: lead.notes || undefined,
    createdAt: lead.created_at,
    updatedAt: lead.updated_at,
    disposition: (lead.disposition as 'UNDECIDED' | 'QUALIFIED' | 'DISQUALIFIED') || 'UNDECIDED',
  }));

  // Fixed stats calculation - KEEP and PASS are mutually exclusive
  const stats: DashboardStats = {
    totalLeads: leads.length,
    hotDeals: leads.filter(lead => lead.status === 'HOT').length,
    warmDeals: leads.filter(lead => lead.status === 'WARM').length,
    coldDeals: leads.filter(lead => lead.status === 'COLD').length,
    passDeals: leads.filter(lead => lead.status === 'PASS' || lead.disposition === 'DISQUALIFIED').length,
    keepDeals: leads.filter(lead => lead.status === 'KEEP' || lead.disposition === 'QUALIFIED').length,
    passRate: leads.length > 0 ? Math.round((leads.filter(lead => lead.status === 'PASS' || lead.disposition === 'DISQUALIFIED').length / leads.length) * 100) : 0,
    keepRate: leads.length > 0 ? Math.round((leads.filter(lead => lead.status === 'KEEP' || lead.disposition === 'QUALIFIED').length / leads.length) * 100) : 0,
    thisWeekLeads: leads.filter(lead => {
      const leadDate = new Date(lead.createdAt || '');
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return leadDate >= weekAgo;
    }).length,
    thisMonthLeads: leads.filter(lead => {
      const leadDate = new Date(lead.createdAt || '');
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return leadDate >= monthAgo;
    }).length,
    avgResponseTime: '2.5 hrs'
  };

  // Transform activities data
  const activities: ActivityItem[] = activitiesData.map(activity => ({
    id: activity.id,
    type: activity.action_type,
    description: activity.description,
    userName: activity.user_name,
    timestamp: new Date(activity.created_at),
    leadId: activity.reference_id || '',
    module: activity.module,
    actionType: activity.action_type,
    referenceId: activity.reference_id,
    referenceType: activity.reference_type,
    metadata: activity.metadata
  }));

  return {
    leads,
    stats,
    activities,
    loading: authLoading || leadsLoading || activitiesLoading,
    error: leadsError?.message || activitiesError?.message || null,
    refetch: async () => {
      if (!user?.id || authLoading) return;
      await refetchLeads();
      await refetchActivities();
    }
  };
}
