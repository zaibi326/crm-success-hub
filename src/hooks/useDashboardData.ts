
import { useState, useEffect } from 'react';
import { TaxLead } from '@/types/taxLead';

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState({
    totalLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    totalRevenue: 0,
    conversionRate: 0,
    recentLeads: [] as TaxLead[]
  });

  useEffect(() => {
    // Simulate API call
    const mockData = {
      totalLeads: 1247,
      hotLeads: 89,
      warmLeads: 234,
      coldLeads: 456,
      totalRevenue: 125000,
      conversionRate: 12.5,
      recentLeads: [
        {
          id: 1,
          taxId: 'TX-001-2024',
          ownerName: 'John Smith',
          propertyAddress: '123 Main St, Dallas, TX 75201',
          currentArrears: 15000,
          status: 'HOT' as const,
          temperature: 'HOT' as const,
          occupancyStatus: 'OWNER_OCCUPIED' as const,
          email: 'john.smith@email.com',
          phone: '(555) 123-4567',
          taxLawsuitNumber: 'TL-2024-001',
          notes: 'High-value property with significant arrears',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          disposition: 'UNDECIDED' as const
        },
        {
          id: 2,
          taxId: 'TX-002-2024',
          ownerName: 'Sarah Johnson',
          propertyAddress: '456 Oak Ave, Houston, TX 77001',
          currentArrears: 8500,
          status: 'WARM' as const,
          temperature: 'WARM' as const,
          occupancyStatus: 'OWNER_OCCUPIED' as const,
          email: 'sarah.j@email.com',
          phone: '(555) 987-6543',
          taxLawsuitNumber: 'TL-2024-002',
          notes: 'Property owner contacted previously',
          createdAt: '2024-01-10T14:20:00Z',
          updatedAt: '2024-01-10T14:20:00Z',
          disposition: 'INTERESTED' as const
        },
        {
          id: 3,
          taxId: 'TX-003-2024',
          ownerName: 'Mike Rodriguez',
          propertyAddress: '789 Pine Rd, Austin, TX 73301',
          currentArrears: 3200,
          status: 'COLD' as const,
          temperature: 'COLD' as const,
          occupancyStatus: 'VACANT' as const,
          phone: '(555) 456-7890',
          taxLawsuitNumber: 'TL-2024-003',
          notes: 'Small arrears, low priority',
          createdAt: '2024-01-05T09:15:00Z',
          updatedAt: '2024-01-05T09:15:00Z',
          disposition: 'UNDECIDED' as const
        }
      ] as TaxLead[]
    };

    setDashboardData(mockData);
  }, []);

  return dashboardData;
}
