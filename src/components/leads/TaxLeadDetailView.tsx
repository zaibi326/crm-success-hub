
import React, { useState, useEffect } from 'react';
import { TaxLead } from '@/types/taxLead';
import { LeadDetailsPage } from './LeadDetailsPage';
import { useComprehensiveLeadActivityTracker } from '@/hooks/useComprehensiveLeadActivityTracker';

interface TaxLeadDetailViewProps {
  selectedLead: TaxLead;
  onBack: () => void;
}

export function TaxLeadDetailView({ selectedLead, onBack }: TaxLeadDetailViewProps) {
  const [lead, setLead] = useState<TaxLead>(selectedLead);
  const { trackLeadViewed, trackLeadUpdated } = useComprehensiveLeadActivityTracker();

  useEffect(() => {
    setLead(selectedLead);
    // Track that the lead was viewed
    trackLeadViewed(selectedLead);
  }, [selectedLead, trackLeadViewed]);

  const handleLeadUpdate = async (updatedLead: TaxLead) => {
    const changedFields = Object.keys(updatedLead).filter(
      key => updatedLead[key as keyof TaxLead] !== lead[key as keyof TaxLead]
    );
    
    if (changedFields.length > 0) {
      const oldValues = changedFields.reduce((acc, field) => {
        acc[field] = lead[field as keyof TaxLead];
        return acc;
      }, {} as any);
      
      trackLeadUpdated(updatedLead, changedFields, oldValues);
    }
    
    setLead(updatedLead);
  };

  const handleBackToLeads = () => {
    console.log('TaxLeadDetailView: Back to leads called');
    onBack();
  };

  return (
    <LeadDetailsPage
      lead={lead}
      onBack={handleBackToLeads}
      onLeadUpdate={handleLeadUpdate}
    />
  );
}
