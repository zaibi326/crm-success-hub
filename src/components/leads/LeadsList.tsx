
import React from 'react';
import { TaxLead } from '@/types/taxLead';
import { LeadListItem } from './LeadListItem';

interface LeadsListProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  selectedLeadId?: number;
  onLeadUpdate: (lead: TaxLead) => void;
  onLeadDelete: (leadId: number) => void;
}

export function LeadsList({ 
  leads, 
  onLeadSelect, 
  selectedLeadId, 
  onLeadUpdate, 
  onLeadDelete 
}: LeadsListProps) {
  return (
    <div className="space-y-2">
      {leads.map((lead) => (
        <LeadListItem
          key={lead.id}
          lead={lead}
          isSelected={selectedLeadId === lead.id}
          onClick={() => onLeadSelect(lead)}
          onUpdate={onLeadUpdate}
          onDelete={() => onLeadDelete(lead.id)}
        />
      ))}
    </div>
  );
}
