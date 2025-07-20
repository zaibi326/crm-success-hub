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
}

interface ActivityItem {
  id: string;
  type: 'lead_created' | 'lead_updated' | 'note_added' | 'status_changed';
  description: string;
  userName: string;
  timestamp: Date;
  leadId: string;
}

const mockTaxLeads: TaxLead[] = [
  {
    id: 1,
    taxId: '234-567-890',
    ownerName: 'John Smith',
    propertyAddress: '123 Main St, Anytown',
    currentArrears: 5000,
    status: 'HOT',
    email: 'john.123@gmail.com',
    phone: '555-123-4567',
    createdAt: '2023-01-15',
    disposition: 'QUALIFIED',
    firstName: 'John',
    lastName: 'Smith',
    temperature: 'hot',
    occupancyStatus: 'occupied',
    attachedFiles: [],
    askingPrice: 75000,
    mortgagePrice: 50000,
    hasDeath: false,
    deathNotes: '',
    hasProbate: false,
    probateNotes: '',
    hasLawsuit: false,
    lawsuitNotes: '',
    hasAdditionalTaxingEntities: false,
    additionalTaxingNotes: '',
    vestingDeedDate: '',
    grantorGranteeName: '',
    ownerOfRecord: 'John Smith',
    leadSource: 'Website',
    campaignId: 'CAMP001',
    agentName: 'Agent Smith'
  },
  {
    id: 2,
    taxId: '345-678-901',
    ownerName: 'Alice Johnson',
    propertyAddress: '456 Oak Ave, Anytown',
    currentArrears: 3500,
    status: 'WARM',
    email: 'john.123@gmail.com',
    phone: '555-234-5678',
    createdAt: '2023-02-20',
    disposition: 'UNDECIDED',
    firstName: 'Alice',
    lastName: 'Johnson',
    temperature: 'warm',
    occupancyStatus: 'occupied',
    attachedFiles: [],
    askingPrice: 60000,
    mortgagePrice: 40000,
    hasDeath: false,
    deathNotes: '',
    hasProbate: false,
    probateNotes: '',
    hasLawsuit: false,
    lawsuitNotes: '',
    hasAdditionalTaxingEntities: false,
    additionalTaxingNotes: '',
    vestingDeedDate: '',
    grantorGranteeName: '',
    ownerOfRecord: 'Alice Johnson',
    leadSource: 'Referral',
    campaignId: 'CAMP002',
    agentName: 'Agent Brown'
  },
  {
    id: 3,
    taxId: '456-789-012',
    ownerName: 'Bob Williams',
    propertyAddress: '789 Pine Ln, Anytown',
    currentArrears: 7200,
    status: 'COLD',
    email: 'john.123@gmail.com',
    phone: '555-345-6789',
    createdAt: '2023-03-10',
    disposition: 'DISQUALIFIED',
    firstName: 'Bob',
    lastName: 'Williams',
    temperature: 'cold',
    occupancyStatus: 'vacant',
    attachedFiles: [],
    askingPrice: 80000,
    mortgagePrice: 55000,
    hasDeath: true,
    deathNotes: 'Natural causes',
    hasProbate: true,
    probateNotes: 'In progress',
    hasLawsuit: false,
    lawsuitNotes: '',
    hasAdditionalTaxingEntities: true,
    additionalTaxingNotes: 'City liens',
    vestingDeedDate: '',
    grantorGranteeName: '',
    ownerOfRecord: 'Bob Williams',
    leadSource: 'Direct Mail',
    campaignId: 'CAMP003',
    agentName: 'Agent Davis'
  },
  {
    id: 4,
    taxId: '567-890-123',
    ownerName: 'Emily Brown',
    propertyAddress: '101 Elm Rd, Anytown',
    currentArrears: 2800,
    status: 'PASS',
    email: 'john.123@gmail.com',
    phone: '555-456-7890',
    createdAt: '2023-04-05',
    disposition: 'QUALIFIED',
    firstName: 'Emily',
    lastName: 'Brown',
    temperature: 'pass',
    occupancyStatus: 'occupied',
    attachedFiles: [],
    askingPrice: 55000,
    mortgagePrice: 35000,
    hasDeath: false,
    deathNotes: '',
    hasProbate: false,
    probateNotes: '',
    hasLawsuit: false,
    lawsuitNotes: '',
    hasAdditionalTaxingEntities: false,
    additionalTaxingNotes: '',
    vestingDeedDate: '',
    grantorGranteeName: '',
    ownerOfRecord: 'Emily Brown',
    leadSource: 'Online Ad',
    campaignId: 'CAMP004',
    agentName: 'Agent Wilson'
  },
  {
    id: 5,
    taxId: '678-901-234',
    ownerName: 'David Lee',
    propertyAddress: '222 Maple Dr, Anytown',
    currentArrears: 6100,
    status: 'HOT',
    email: 'john.123@gmail.com',
    phone: '555-567-9012',
    createdAt: '2023-05-12',
    disposition: 'UNDECIDED',
    firstName: 'David',
    lastName: 'Lee',
    temperature: 'hot',
    occupancyStatus: 'occupied',
    attachedFiles: [],
    askingPrice: 70000,
    mortgagePrice: 48000,
    hasDeath: false,
    deathNotes: '',
    hasProbate: false,
    probateNotes: '',
    hasLawsuit: true,
    lawsuitNotes: 'Property dispute',
    hasAdditionalTaxingEntities: false,
    additionalTaxingNotes: '',
    vestingDeedDate: '',
    grantorGranteeName: '',
    ownerOfRecord: 'David Lee',
    leadSource: 'Website',
    campaignId: 'CAMP005',
    agentName: 'Agent Garcia'
  },
  {
    id: 6,
    taxId: '789-012-345',
    ownerName: 'Sarah Taylor',
    propertyAddress: '333 Oak St, Anytown',
    currentArrears: 4200,
    status: 'WARM',
    email: 'john.123@gmail.com',
    phone: '555-678-0123',
    createdAt: '2023-06-18',
    disposition: 'DISQUALIFIED',
    firstName: 'Sarah',
    lastName: 'Taylor',
    temperature: 'warm',
    occupancyStatus: 'vacant',
    attachedFiles: [],
    askingPrice: 62000,
    mortgagePrice: 42000,
    hasDeath: false,
    deathNotes: '',
    hasProbate: true,
    probateNotes: 'Awaiting court date',
    hasLawsuit: false,
    lawsuitNotes: '',
    hasAdditionalTaxingEntities: true,
    additionalTaxingNotes: 'School district taxes',
    vestingDeedDate: '',
    grantorGranteeName: '',
    ownerOfRecord: 'Sarah Taylor',
    leadSource: 'Referral',
    campaignId: 'CAMP006',
    agentName: 'Agent Martinez'
  },
  {
    id: 7,
    taxId: '890-123-456',
    ownerName: 'Michael Clark',
    propertyAddress: '444 Pine Ave, Anytown',
    currentArrears: 8500,
    status: 'COLD',
    email: 'john.123@gmail.com',
    phone: '555-789-1234',
    createdAt: '2023-07-22',
    disposition: 'QUALIFIED',
    firstName: 'Michael',
    lastName: 'Clark',
    temperature: 'cold',
    occupancyStatus: 'occupied',
    attachedFiles: [],
    askingPrice: 90000,
    mortgagePrice: 60000,
    hasDeath: true,
    deathNotes: 'Heart attack',
    hasProbate: false,
    probateNotes: '',
    hasLawsuit: false,
    lawsuitNotes: '',
    hasAdditionalTaxingEntities: false,
    additionalTaxingNotes: '',
    vestingDeedDate: '',
    grantorGranteeName: '',
    ownerOfRecord: 'Michael Clark',
    leadSource: 'Direct Mail',
    campaignId: 'CAMP007',
    agentName: 'Agent Robinson'
  },
  {
    id: 8,
    taxId: '901-234-567',
    ownerName: 'Linda White',
    propertyAddress: '555 Elm Ln, Anytown',
    currentArrears: 3900,
    status: 'PASS',
    email: 'john.123@gmail.com',
    phone: '555-890-2345',
    createdAt: '2023-08-01',
    disposition: 'UNDECIDED',
    firstName: 'Linda',
    lastName: 'White',
    temperature: 'pass',
    occupancyStatus: 'vacant',
    attachedFiles: [],
    askingPrice: 58000,
    mortgagePrice: 38000,
    hasDeath: false,
    deathNotes: '',
    hasProbate: false,
    probateNotes: '',
    hasLawsuit: false,
    lawsuitNotes: '',
    hasAdditionalTaxingEntities: false,
    additionalTaxingNotes: '',
    vestingDeedDate: '',
    grantorGranteeName: '',
    ownerOfRecord: 'Linda White',
    leadSource: 'Online Ad',
    campaignId: 'CAMP008',
    agentName: 'Agent Hall'
  },
  {
    id: 9,
    taxId: '012-345-678',
    ownerName: 'James Hall',
    propertyAddress: '666 Maple Rd, Anytown',
    currentArrears: 5700,
    status: 'HOT',
    email: 'john.123@gmail.com',
    phone: '555-901-3456',
    createdAt: '2023-09-08',
    disposition: 'DISQUALIFIED',
    firstName: 'James',
    lastName: 'Hall',
    temperature: 'hot',
    occupancyStatus: 'occupied',
    attachedFiles: [],
    askingPrice: 72000,
    mortgagePrice: 52000,
    hasDeath: false,
    deathNotes: '',
    hasProbate: true,
    probateNotes: 'Executor appointed',
    hasLawsuit: false,
    lawsuitNotes: '',
    hasAdditionalTaxingEntities: false,
    additionalTaxingNotes: '',
    vestingDeedDate: '',
    grantorGranteeName: '',
    ownerOfRecord: 'James Hall',
    leadSource: 'Website',
    campaignId: 'CAMP009',
    agentName: 'Agent Young'
  },
  {
    id: 10,
    taxId: '123-456-789',
    ownerName: 'Patricia Green',
    propertyAddress: '777 Oak Dr, Anytown',
    currentArrears: 4800,
    status: 'WARM',
    email: 'john.123@gmail.com',
    phone: '555-012-4567',
    createdAt: '2023-10-15',
    disposition: 'QUALIFIED',
    firstName: 'Patricia',
    lastName: 'Green',
    temperature: 'warm',
    occupancyStatus: 'vacant',
    attachedFiles: [],
    askingPrice: 65000,
    mortgagePrice: 45000,
    hasDeath: false,
    deathNotes: '',
    hasProbate: false,
    probateNotes: '',
    hasLawsuit: false,
    lawsuitNotes: '',
    hasAdditionalTaxingEntities: false,
    additionalTaxingNotes: '',
    vestingDeedDate: '',
    grantorGranteeName: '',
    ownerOfRecord: 'Patricia Green',
    leadSource: 'Referral',
    campaignId: 'CAMP010',
    agentName: 'Agent King'
  }
];

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'lead_created',
    description: 'New lead added: John Smith',
    userName: 'John Doe',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    leadId: '1'
  },
  {
    id: '2',
    type: 'status_changed',
    description: 'Lead status changed to HOT',
    userName: 'Jane Smith',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    leadId: '2'
  },
  {
    id: '3',
    type: 'note_added',
    description: 'Follow-up note added',
    userName: 'Mike Wilson',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    leadId: '3'
  },
  {
    id: '4',
    type: 'lead_updated',
    description: 'Lead information updated',
    userName: 'Emily Davis',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    leadId: '4'
  },
  {
    id: '5',
    type: 'lead_created',
    description: 'New lead added: Patricia Green',
    userName: 'Robert Brown',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    leadId: '5'
  }
];

export function useDashboardData() {
  const [leads, setLeads] = useState<TaxLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setLeads(mockTaxLeads);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refetch = async () => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setLeads(mockTaxLeads);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    await fetchDashboardData();
  };

  // Calculate stats from leads
  const stats: DashboardStats = {
    totalLeads: leads.length,
    hotDeals: leads.filter(lead => lead.status === 'HOT').length,
    warmDeals: leads.filter(lead => lead.status === 'WARM').length,
    coldDeals: leads.filter(lead => lead.status === 'COLD').length,
    passDeals: leads.filter(lead => lead.status === 'PASS').length,
    keepDeals: leads.filter(lead => lead.disposition === 'QUALIFIED').length,
    passRate: leads.length > 0 ? Math.round((leads.filter(lead => lead.status === 'PASS').length / leads.length) * 100) : 0,
    keepRate: leads.length > 0 ? Math.round((leads.filter(lead => lead.disposition === 'QUALIFIED').length / leads.length) * 100) : 0
  };

  return {
    leads,
    stats,
    activities: mockActivities,
    loading,
    refetch
  };
}
