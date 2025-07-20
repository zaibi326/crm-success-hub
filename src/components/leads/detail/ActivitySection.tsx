
import React from 'react';
import { EnhancedActivityTimeline } from '../EnhancedActivityTimeline';
import { TaxLead } from '@/types/taxLead';

interface ActivityItem {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  user: string;
}

interface ActivitySectionProps {
  lead: TaxLead;
  readOnly?: boolean;
  activities?: ActivityItem[];
}

export function ActivitySection({ lead, readOnly = false, activities }: ActivitySectionProps) {
  return <EnhancedActivityTimeline lead={lead} readOnly={readOnly} activities={activities} />;
}
