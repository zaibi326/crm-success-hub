
import { useMemo } from 'react';
import { TaxLead } from '@/types/taxLead';

interface UseLeadsFilterProps {
  leads: TaxLead[];
  searchTerm: string;
  filterStatus: string;
  sortBy: string;
}

export function useLeadsFilter({ leads, searchTerm, filterStatus, sortBy }: UseLeadsFilterProps) {
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        lead.ownerName.toLowerCase().includes(searchTermLower) ||
        lead.taxId.toLowerCase().includes(searchTermLower) ||
        lead.propertyAddress.toLowerCase().includes(searchTermLower) ||
        (lead.email && lead.email.toLowerCase().includes(searchTermLower))
      );
    }).filter(lead => {
      if (filterStatus === 'all') return true;
      return lead.status.toLowerCase() === filterStatus.toLowerCase();
    }).sort((a, b) => {
      switch (sortBy) {
        case 'ownerName':
          return a.ownerName.localeCompare(b.ownerName);
        case 'currentArrears':
          return (b.currentArrears || 0) - (a.currentArrears || 0);
        case 'taxId':
          return a.taxId.localeCompare(b.taxId);
        default:
          return 0;
      }
    });
  }, [leads, searchTerm, filterStatus, sortBy]);

  return filteredLeads;
}
