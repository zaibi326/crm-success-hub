
import React from 'react';
import { TaxLead } from '@/types/taxLead';
import { LeadListItem } from './LeadListItem';

interface LeadListViewProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  onLeadUpdate: (lead: TaxLead) => void;
  onLeadDelete: (leadId: number) => void;
  selectedLeadId?: number;
}

export function LeadListView({ 
  leads, 
  onLeadSelect, 
  onLeadUpdate, 
  onLeadDelete,
  selectedLeadId 
}: LeadListViewProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HOT': return 'bg-red-100 text-red-800';
      case 'WARM': return 'bg-yellow-100 text-yellow-800';
      case 'COLD': return 'bg-blue-100 text-blue-800';
      case 'PASS': return 'bg-gray-100 text-gray-800';
      case 'KEEP': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
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
