
import { useState, useEffect } from 'react';
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

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<TaxLead[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    hotDeals: 0,
    warmDeals: 0,
    coldDeals: 0,
    passRate: 0,
    totalLeads: 0,
    keepRate: 0,
    passDeals: 0,
    keepDeals: 0,
    thisWeekLeads: 0,
    thisMonthLeads: 0,
    avgResponseTime: '0h 0m'
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Simulate API call
    const mockLeads: TaxLead[] = [
      {
        id: 1,
        taxId: 'TX-001-2024',
        ownerName: 'John Smith',
        propertyAddress: '123 Main St, Dallas, TX 75201',
        currentArrears: 15000,
        status: 'HOT',
        temperature: 'HOT',
        occupancyStatus: 'OWNER_OCCUPIED',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        taxLawsuitNumber: 'TL-2024-001',
        notes: 'High-value property with significant arrears',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        disposition: 'UNDECIDED'
      },
      {
        id: 2,
        taxId: 'TX-002-2024',
        ownerName: 'Sarah Johnson',
        propertyAddress: '456 Oak Ave, Houston, TX 77001',
        currentArrears: 8500,
        status: 'WARM',
        temperature: 'WARM',
        occupancyStatus: 'OWNER_OCCUPIED',
        email: 'sarah.j@email.com',
        phone: '(555) 987-6543',
        taxLawsuitNumber: 'TL-2024-002',
        notes: 'Property owner contacted previously',
        createdAt: '2024-01-10T14:20:00Z',
        updatedAt: '2024-01-10T14:20:00Z',
        disposition: 'INTERESTED'
      },
      {
        id: 3,
        taxId: 'TX-003-2024',
        ownerName: 'Mike Rodriguez',
        propertyAddress: '789 Pine Rd, Austin, TX 73301',
        currentArrears: 3200,
        status: 'COLD',
        temperature: 'COLD',
        occupancyStatus: 'VACANT',
        phone: '(555) 456-7890',
        taxLawsuitNumber: 'TL-2024-003',
        notes: 'Small arrears, low priority',
        createdAt: '2024-01-05T09:15:00Z',
        updatedAt: '2024-01-05T09:15:00Z',
        disposition: 'UNDECIDED'
      }
    ];

    const mockStats: DashboardStats = {
      hotDeals: mockLeads.filter(lead => lead.status === 'HOT').length,
      warmDeals: mockLeads.filter(lead => lead.status === 'WARM').length,
      coldDeals: mockLeads.filter(lead => lead.status === 'COLD').length,
      passRate: 15,
      totalLeads: mockLeads.length,
      keepRate: 25,
      passDeals: Math.round(mockLeads.length * 0.15),
      keepDeals: Math.round(mockLeads.length * 0.25),
      thisWeekLeads: 12,
      thisMonthLeads: 47,
      avgResponseTime: '2h 15m'
    };

    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'lead_created',
        description: 'New lead created',
        userName: 'John Doe',
        timestamp: new Date(),
        leadId: '1',
        module: 'leads',
        actionType: 'create'
      },
      {
        id: '2',
        type: 'lead_updated',
        description: 'Lead status updated',
        userName: 'Jane Smith',
        timestamp: new Date(Date.now() - 3600000),
        leadId: '2',
        module: 'leads',
        actionType: 'update'
      }
    ];

    setLeads(mockLeads);
    setStats(mockStats);
    setActivities(mockActivities);
    setLoading(false);
  }, []);

  const refetch = async () => {
    setLoading(true);
    // Simulate refetch delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return {
    leads,
    stats,
    activities,
    loading,
    refetch
  };
}
