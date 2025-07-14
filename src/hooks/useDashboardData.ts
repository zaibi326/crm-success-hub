
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export function useDashboardData() {
  const [leads, setLeads] = useState<TaxLead[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    hotDeals: 0,
    warmDeals: 0,
    coldDeals: 0,
    passRate: 0,
    totalLeads: 0
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('campaign_leads')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        return;
      }

      const leadsData = data?.map(lead => ({
        id: lead.id,
        ownerName: lead.owner_name,
        propertyAddress: lead.property_address,
        phone: lead.phone || '',
        email: lead.email || '',
        taxId: lead.tax_id || '',
        currentArrears: lead.current_arrears || 0,
        taxLawsuitNumber: lead.tax_lawsuit_number || '',
        status: lead.status || 'COLD',
        notes: lead.notes || '',
        createdAt: new Date(lead.created_at),
        updatedAt: new Date(lead.updated_at)
      })) || [];

      setLeads(leadsData);
      calculateStats(leadsData);
      generateActivities(leadsData);
    } catch (error) {
      console.error('Error in fetchLeads:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (leadsData: TaxLead[]) => {
    const hotCount = leadsData.filter(lead => lead.status === 'HOT').length;
    const warmCount = leadsData.filter(lead => lead.status === 'WARM').length;
    const coldCount = leadsData.filter(lead => lead.status === 'COLD').length;
    const passCount = leadsData.filter(lead => lead.status === 'PASS').length;
    const totalCount = leadsData.length;
    
    const passRate = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

    setStats({
      hotDeals: hotCount,
      warmDeals: warmCount,
      coldDeals: coldCount,
      passRate,
      totalLeads: totalCount
    });
  };

  const generateActivities = (leadsData: TaxLead[]) => {
    const recentActivities: ActivityItem[] = [];
    
    // Sort leads by most recently updated
    const sortedLeads = [...leadsData].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Generate activities for the most recent 10 leads
    sortedLeads.slice(0, 10).forEach((lead, index) => {
      const timeDiff = Date.now() - new Date(lead.updatedAt).getTime();
      const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
      
      let description = '';
      let type: ActivityItem['type'] = 'lead_updated';
      
      if (new Date(lead.createdAt).getTime() === new Date(lead.updatedAt).getTime()) {
        description = `New lead created for ${lead.ownerName}`;
        type = 'lead_created';
      } else {
        description = `Updated lead for ${lead.ownerName} - Status: ${lead.status}`;
        type = 'status_changed';
      }

      recentActivities.push({
        id: `${lead.id}-${index}`,
        type,
        description,
        userName: 'Current User',
        timestamp: new Date(lead.updatedAt),
        leadId: lead.id
      });
    });

    setActivities(recentActivities);
  };

  useEffect(() => {
    fetchLeads();

    // Set up real-time subscription
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaign_leads'
        },
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    leads,
    stats,
    activities,
    loading,
    refetch: fetchLeads
  };
}
