import { useState, useEffect } from 'react';
import { TaxLead } from '@/types/taxLead';

interface DashboardData {
  totalLeads: number;
  activeLeads: number;
  conversions: number;
  revenue: number;
  recentActivity: { id: number; type: string; message: string; timestamp: string }[];
  chartData: { name: string; leads: number; conversions: number }[];
  leadsByStatus: { status: string; count: number; percentage: number }[];
  topLeads: TaxLead[];
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
    disposition: 'QUALIFIED'
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
    disposition: 'UNDECIDED'
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
    disposition: 'DISQUALIFIED'
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
    disposition: 'QUALIFIED'
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
    disposition: 'UNDECIDED'
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
    disposition: 'DISQUALIFIED'
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
    disposition: 'QUALIFIED'
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
    disposition: 'UNDECIDED'
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
    disposition: 'DISQUALIFIED'
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
    disposition: 'QUALIFIED'
  }
];

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data
        const mockData: DashboardData = {
          totalLeads: 1250,
          activeLeads: 890,
          conversions: 45,
          revenue: 125000,
          recentActivity: [
            { id: 1, type: 'lead_added', message: 'New lead added: John Smith', timestamp: '2 hours ago' },
            { id: 2, type: 'conversion', message: 'Lead converted: Sarah Johnson', timestamp: '4 hours ago' },
            { id: 3, type: 'follow_up', message: 'Follow-up scheduled with Mike Wilson', timestamp: '1 day ago' },
            { id: 4, type: 'lead_added', message: 'New lead added: Emily Davis', timestamp: '2 days ago' },
            { id: 5, type: 'conversion', message: 'Lead converted: Robert Brown', timestamp: '3 days ago' }
          ],
          chartData: [
            { name: 'Jan', leads: 65, conversions: 8 },
            { name: 'Feb', leads: 85, conversions: 12 },
            { name: 'Mar', leads: 120, conversions: 15 },
            { name: 'Apr', leads: 95, conversions: 18 },
            { name: 'May', leads: 110, conversions: 22 },
            { name: 'Jun', leads: 135, conversions: 25 }
          ],
          leadsByStatus: [
            { status: 'HOT', count: 45, percentage: 35 },
            { status: 'WARM', count: 38, percentage: 30 },
            { status: 'COLD', count: 28, percentage: 22 },
            { status: 'PASS', count: 17, percentage: 13 }
          ],
          topLeads: mockTaxLeads.slice(0, 5).map(lead => ({
            ...lead,
            score: Math.floor(Math.random() * 100) + 1,
            lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          }))
        };

        setDashboardData(mockData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getLeadsByDisposition = () => {
    if (!dashboardData) return [];
    
    const dispositionCounts = dashboardData.topLeads.reduce((acc, lead) => {
      const disposition = lead.disposition || 'UNDECIDED';
      acc[disposition] = (acc[disposition] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dispositionCounts).map(([disposition, count]) => ({
      disposition,
      count,
      percentage: Math.round((count / dashboardData.topLeads.length) * 100)
    }));
  };

  const getQualifiedLeads = () => {
    if (!dashboardData) return [];
    return dashboardData.topLeads.filter(lead => lead.disposition === 'QUALIFIED');
  };

  return {
    dashboardData,
    isLoading,
    error,
    getLeadsByDisposition,
    getQualifiedLeads
  };
}
