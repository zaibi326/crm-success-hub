
import React from 'react';
import { LeadHeader } from './LeadHeader';
import { LeadInsights } from './LeadInsights';
import { TaxLeadDetailsForm } from './TaxLeadDetailsForm';
import { LeadStatusButtons } from './LeadStatusButtons';
import { EnhancedLeadContactInfo } from './EnhancedLeadContactInfo';
import { TaxLead } from '@/types/taxLead';

interface LeadDetailViewProps {
  lead: TaxLead;
  onBack: () => void;
  onStatusChange: (status: 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP') => void;
  onSave: (updatedLead: TaxLead) => void;
  canEdit: boolean;
}

export function LeadDetailView({ lead, onBack, onStatusChange, onSave, canEdit }: LeadDetailViewProps) {
  return (
    <div className="space-y-6">
      <LeadHeader lead={lead} onBack={onBack} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <EnhancedLeadContactInfo lead={lead} />
        </div>
        
        <div className="space-y-6">
          <LeadInsights lead={lead} />
          <LeadStatusButtons 
            currentStatus={lead.status}
            onStatusChange={onStatusChange}
            disabled={!canEdit}
          />
        </div>
      </div>
      
      <TaxLeadDetailsForm 
        lead={lead} 
        onSave={onSave}
        userRole={canEdit ? "editor" : "viewer"}
      />
    </div>
  );
}
