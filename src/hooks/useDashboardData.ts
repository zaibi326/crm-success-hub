import { useState, useEffect } from 'react';
import { TaxLead } from '@/types/taxLead';
import { supabase } from '@/integrations/supabase/client';

export function useDashboardData() {
  // State variables
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

  // Fetch leads from Supabase (example)
  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        // const { data, error } = await supabase
        //   .from('leads')
        //   .select('*');

        // if (error) {
        //   setError(error);
        // } else {
        //   setLeads(data || []);
        // }
        setLeads(mockTaxLeads);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return {
    leads,
    loading,
    error,
  };
}
