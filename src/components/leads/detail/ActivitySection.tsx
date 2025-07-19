
import React from 'react';
import { EnhancedActivityTimeline } from '../EnhancedActivityTimeline';
import { TaxLead } from '@/types/taxLead';

interface ActivitySectionProps {
  lead: TaxLead;
  readOnly?: boolean;
}

export function ActivitySection({ lead, readOnly = false }: ActivitySectionProps) {
  return <EnhancedActivityTimeline lead={lead} readOnly={readOnly} />;
}
