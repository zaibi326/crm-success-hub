
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FilterComponentProps } from './types';

const leadStatusOptions = [
  { value: 'not_set', label: 'Not set' },
  { value: 'new_untouched', label: '#New Untouched#' },
  { value: 'discovery', label: 'Discovery' },
  { value: 'already_listed', label: 'Already Listed' },
  { value: 'price_too_high', label: 'Price Too High' },
  { value: 'low_motivation', label: 'Low Motivation' },
  { value: 'add_to_follow_up', label: 'Add to Follow up' },
  { value: 'inquiry', label: 'Inquiry' },
  { value: 'interested_listing', label: 'Interested - Listing' },
  { value: 'appointment_completed', label: 'Appointment Completed' },
  { value: 'interested_follow_up', label: 'Interested - Add to Follow up' },
  { value: 'interested_offer_status', label: 'Interested - Set Offer Status' },
  { value: 'contract_sent_out', label: 'Contract Sent Out - Set Contract Status' },
  { value: 'in_contract', label: 'In Contract - Set Manually' },
  { value: 'hot', label: '🔥 Hot' },
  { value: 'warm', label: '🌤️ Warm' },
  { value: 'cold', label: '❄️ Cold' },
  { value: 'keep', label: '✅ Keep' },
  { value: 'pass', label: '⏭️ Pass' }
];

export function LeadStatusFilters({ onAddFilter }: FilterComponentProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-agile-gray-700">Lead Status</Label>
      <div className="grid grid-cols-2 gap-2">
        {leadStatusOptions.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            size="sm"
            onClick={() => onAddFilter('status', 'equals', option.value, `Status: ${option.label}`)}
            className="justify-start text-xs h-8 hover:bg-agile-blue-50 hover:border-agile-blue-300"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
