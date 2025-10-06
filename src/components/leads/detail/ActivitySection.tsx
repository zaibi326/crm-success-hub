
import React from 'react';
import { DatabaseActivityTimeline } from '../DatabaseActivityTimeline';
import { TaxLead } from '@/types/taxLead';

interface ActivitySectionProps {
  lead: TaxLead;
  readOnly?: boolean;
}

export function ActivitySection({ lead, readOnly = false }: ActivitySectionProps) {
  return <DatabaseActivityTimeline lead={lead} readOnly={readOnly} />;
}
