
import { useState, useEffect } from 'react';
import { TaxLead } from '@/types/taxLead';
import { supabase } from '@/integrations/supabase/client';

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

export function useDashboardData() {
  const [leads, setLeads] = useState<TaxLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const mockTaxLeads: TaxLead[] = [
    {
      id: 1,
      taxId: 'TX001',
      ownerName: 'John Smith',
      firstName: 'John',
      lastName: 'Smith',
      propertyAddress: '123 Main St, Dallas, TX',
      currentArrears: 15000,
      status: 'HOT',
      temperature: 'HOT',
      occupancyStatus: 'OWNER_OCCUPIED',
      disposition: 'QUALIFIED',
      email: 'john@email.com',
      phone: '555-0123',
      taxLawsuitNumber: 'TL001',
      notes: 'Interested buyer',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      taxId: 'TX002',
      ownerName: 'Jane Doe',
      firstName: 'Jane',
      lastName: 'Doe',
      propertyAddress: '456 Oak Ave, Austin, TX',
      currentArrears: 22000,
      status: 'WARM',
      temperature: 'WARM',
      occupancyStatus: 'VACANT',
      disposition: 'UNDECIDED',
      email: 'jane@email.com',
      phone: '555-0456',
      taxLawsuitNumber: 'TL002',
      notes: 'Follow up needed',
      createdAt: '2024-01-14T09:00:00Z',
      updatedAt: '2024-01-14T09:00:00Z'
    }
  ];

  // Calculate stats based on leads
  const calculateStats = (leadsData: TaxLead[]): DashboardStats => {
    const totalLeads = leadsData.length;
    const hotDeals = leadsData.filter(lead => lead.status === 'HOT').length;
    const warmDeals = leadsData.filter(lead => lead.status === 'WARM').length;
    const coldDeals = leadsData.filter(lead => lead.status === 'COLD').length;
    const passDeals = leadsData.filter(lead => lead.status === 'PASS').length;
    const keepDeals = leadsData.filter(lead => lead.status === 'KEEP').length;
    
    return {
      hotDeals,
      warmDeals,
      coldDeals,
      passRate: totalLeads > 0 ? Math.round((passDeals / totalLeads) * 100) : 0,
      totalLeads,
      keepRate: totalLeads > 0 ? Math.round((keepDeals / totalLeads) * 100) : 0,
      passDeals,
      keepDeals,
      thisWeekLeads: leadsData.filter(lead => {
        const leadDate = new Date(lead.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return leadDate >= weekAgo;
      }).length,
      thisMonthLeads: leadsData.filter(lead => {
        const leadDate = new Date(lead.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return leadDate >= monthAgo;
      }).length,
      avgResponseTime: '2.5h'
    };
  };

  // Mock activities
  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'lead_update',
      description: 'Updated lead status to HOT',
      userName: 'John Doe',
      timestamp: new Date(),
      leadId: '1',
      module: 'leads',
      actionType: 'update'
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      // For now, using mock data
      setLeads(mockTaxLeads);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = async () => {
    await fetchData();
  };

  return {
    leads,
    stats: calculateStats(leads),
    activities: mockActivities,
    loading,
    refetch
  };
}
