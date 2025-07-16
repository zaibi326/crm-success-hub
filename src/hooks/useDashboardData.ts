
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
      setLoading(true);
      const { data, error } = await supabase
        .from('campaign_leads')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        return;
      }

      const leadsData = data?.map((lead, index) => {
        // Split owner_name into firstName and lastName
        const nameParts = lead.owner_name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        return {
          id: index + 1, // Use index + 1 for numeric ID as expected by TaxLead interface
          taxId: lead.tax_id || '',
          ownerName: lead.owner_name,
          propertyAddress: lead.property_address,
          taxLawsuitNumber: lead.tax_lawsuit_number || '',
          currentArrears: lead.current_arrears || 0,
          status: lead.status || 'COLD',
          notes: lead.notes || '',
          phone: lead.phone || '',
          email: lead.email || '',
          firstName,
          lastName,
          temperature: (lead.status || 'COLD') as 'HOT' | 'WARM' | 'COLD',
          occupancyStatus: 'VACANT' as const,
          createdAt: lead.created_at,
          updatedAt: lead.updated_at,
          supabaseId: lead.id
        } as TaxLead;
      }) || [];

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
      new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    );

    // Generate activities for the most recent 10 leads
    sortedLeads.slice(0, 10).forEach((lead, index) => {
      const updatedAt = new Date(lead.updatedAt || Date.now());
      const createdAt = new Date(lead.createdAt || Date.now());
      
      let description = '';
      let type: ActivityItem['type'] = 'lead_updated';
      
      // Check if this is a newly created lead (within last hour)
      const timeDiff = Math.abs(updatedAt.getTime() - createdAt.getTime());
      const isNewLead = timeDiff < 3600000; // 1 hour in milliseconds
      
      if (isNewLead) {
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
        timestamp: updatedAt,
        leadId: lead.id.toString()
      });
    });

    setActivities(recentActivities);
  };

  useEffect(() => {
    fetchLeads();

    // Set up real-time subscription for campaign_leads changes
    const channelName = `dashboard-leads-${Date.now()}`;
    console.log('Creating Dashboard Supabase channel:', channelName);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaign_leads'
        },
        (payload) => {
          console.log('Dashboard received realtime update:', payload);
          // Refetch data when any change occurs
          fetchLeads();
        }
      )
      .subscribe((status) => {
        console.log('Dashboard channel subscription status:', status);
      });

    return () => {
      console.log('Cleaning up dashboard channel:', channelName);
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array to ensure this only runs once

  return {
    leads,
    stats,
    activities,
    loading,
    refetch: fetchLeads
  };
}
