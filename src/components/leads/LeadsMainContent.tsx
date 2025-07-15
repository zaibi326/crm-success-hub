
import React from 'react';
import { TaxLead } from '@/types/taxLead';
import { LeadTableView } from './LeadTableView';
import { LeadCardView } from './LeadCardView';
import { LeadCalendarView } from './LeadCalendarView';
import { LeadTimelineView } from './LeadTimelineView';
import { LeadBadgeView } from './LeadBadgeView';

interface LeadsMainContentProps {
  currentView: 'table' | 'card' | 'calendar' | 'timeline' | 'badge';
  filteredLeads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
  handleSort: (field: string) => void;
  onLeadsUpdate?: (leads: TaxLead[]) => void;
  onDeleteSingleLead?: (leadId: number) => void;
  onDeleteMultipleLeads?: (leadIds: number[]) => void;
}

export function LeadsMainContent({
  currentView,
  filteredLeads,
  onLeadSelect,
  getStatusBadge,
  handleSort,
  onLeadsUpdate,
  onDeleteSingleLead,
  onDeleteMultipleLeads
}: LeadsMainContentProps) {
  // Handle lead edit - for now, just open the lead for selection
  const handleLeadEdit = (lead: TaxLead) => {
    onLeadSelect(lead);
  };

  switch (currentView) {
    case 'table':
      return (
        <LeadTableView
          leads={filteredLeads}
          onLeadSelect={onLeadSelect}
          getStatusBadge={getStatusBadge}
          handleSort={handleSort}
          onDeleteSingleLead={onDeleteSingleLead}
          onDeleteMultipleLeads={onDeleteMultipleLeads}
        />
      );
    case 'card':
      return (
        <LeadCardView
          leads={filteredLeads}
          onLeadSelect={onLeadSelect}
          onLeadEdit={handleLeadEdit}
          getStatusBadge={getStatusBadge}
        />
      );
    case 'calendar':
      return (
        <LeadCalendarView
          leads={filteredLeads}
          onLeadSelect={onLeadSelect}
          getStatusBadge={getStatusBadge}
        />
      );
    case 'timeline':
      return (
        <LeadTimelineView
          leads={filteredLeads}
          onLeadSelect={onLeadSelect}
          getStatusBadge={getStatusBadge}
        />
      );
    case 'badge':
      return (
        <LeadBadgeView
          leads={filteredLeads}
          onLeadSelect={onLeadSelect}
          getStatusBadge={getStatusBadge}
        />
      );
    default:
      return (
        <LeadTableView
          leads={filteredLeads}
          onLeadSelect={onLeadSelect}
          getStatusBadge={getStatusBadge}
          handleSort={handleSort}
          onDeleteSingleLead={onDeleteSingleLead}
          onDeleteMultipleLeads={onDeleteMultipleLeads}
        />
      );
  }
}
