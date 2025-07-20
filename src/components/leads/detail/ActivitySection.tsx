
import React from 'react';
import { EnhancedActivityTimeline } from '../EnhancedActivityTimeline';
import { TaxLead } from '@/types/taxLead';
import { ActivityItem } from '@/types/activity';

interface ActivitySectionProps {
  lead: TaxLead;
  readOnly?: boolean;
  activities?: ActivityItem[];
}

export function ActivitySection({ lead, readOnly = false, activities }: ActivitySectionProps) {
  return <EnhancedActivityTimeline lead={lead} readOnly={readOnly} activities={activities} />;
}
