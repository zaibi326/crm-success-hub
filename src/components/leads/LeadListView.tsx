
import React from 'react';
import { LeadListItem } from './LeadListItem';
import { TaxLead } from '@/types/taxLead';

interface LeadListViewProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
}

export function LeadListView({ leads, onLeadSelect, getStatusBadge }: LeadListViewProps) {
  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <LeadListItem
          key={lead.id}
          lead={lead}
          onLeadSelect={onLeadSelect}
          getStatusBadge={getStatusBadge}
        />
      ))}
    </div>
  );
}
