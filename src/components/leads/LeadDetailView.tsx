
import React from 'react';
import { LeadHeader } from './LeadHeader';
import { LeadInsights } from './LeadInsights';
import { LeadDetailsForm } from './LeadDetailsForm';
import { LeadStatusButtons } from './LeadStatusButtons';
import { EnhancedLeadContactInfo } from './EnhancedLeadContactInfo';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  score: number;
  notes: string;
  avatar?: string;
  tags: string[];
}

interface LeadDetailViewProps {
  lead: Lead;
  onBack: () => void;
  onStatusChange: (status: 'HOT' | 'WARM' | 'COLD' | 'PASS') => void;
  onSave: (updatedLead: Lead) => void;
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
          />
        </div>
      </div>
      
      <LeadDetailsForm 
        lead={lead} 
        onSave={onSave}
        canEdit={canEdit}
      />
    </div>
  );
}
