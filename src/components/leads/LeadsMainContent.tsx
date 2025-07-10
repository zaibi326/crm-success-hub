
import React from 'react';
import { LeadCardView } from './LeadCardView';
import { LeadCalendarView } from './LeadCalendarView';
import { LeadTimelineView } from './LeadTimelineView';
import { LeadBadgeView } from './LeadBadgeView';
import { LeadTableView } from './LeadTableView';
import { TaxLead } from '@/types/taxLead';

interface LeadsMainContentProps {
  currentView: 'table' | 'card' | 'calendar' | 'timeline' | 'badge';
  filteredLeads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
  handleSort: (field: string) => void;
  onLeadsUpdate?: (leads: TaxLead[]) => void;
}

export function LeadsMainContent({
  currentView,
  filteredLeads,
  onLeadSelect,
  getStatusBadge,
  handleSort,
  onLeadsUpdate
}: LeadsMainContentProps) {
  return (
    <div className="lg:col-span-3">
      {currentView === 'table' && (
        <LeadTableView
          leads={filteredLeads}
          onLeadSelect={onLeadSelect}
          getStatusBadge={getStatusBadge}
          handleSort={handleSort}
          onLeadsUpdate={onLeadsUpdate}
        />
      )}
      
      {currentView === 'card' && (
        <LeadCardView
          leads={filteredLeads}
          onLeadSelect={onLeadSelect}
          onLeadEdit={onLeadSelect}
          getStatusBadge={getStatusBadge}
        />
      )}
      
      {currentView === 'calendar' && (
        <LeadCalendarView
          leads={filteredLeads}
          onLeadSelect={onLeadSelect}
          getStatusBadge={getStatusBadge}
        />
      )}
      
      {currentView === 'timeline' && (
        <LeadTimelineView
          leads={filteredLeads}
          onLeadSelect={onLeadSelect}
          getStatusBadge={getStatusBadge}
        />
      )}
      
      {currentView === 'badge' && (
        <LeadBadgeView
          leads={filteredLeads}
          onLeadSelect={onLeadSelect}
          getStatusBadge={getStatusBadge}
        />
      )}
    </div>
  );
}
