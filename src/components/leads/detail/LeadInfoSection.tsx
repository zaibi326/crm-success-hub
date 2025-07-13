
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { EditableField } from '../EditableField';
import { TaxLead } from '@/types/taxLead';

interface LeadInfoSectionProps {
  leadData: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: string) => void;
}

const temperatureOptions = [
  { value: 'HOT', label: '🔥 HOT' },
  { value: 'WARM', label: '🌤️ WARM' },
  { value: 'COLD', label: '❄️ COLD' }
];

export function LeadInfoSection({ leadData, onFieldUpdate }: LeadInfoSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-crm-primary" />
          Lead Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {leadData.leadSource && (
          <EditableField
            label="Lead Source"
            value={leadData.leadSource}
            onSave={(value) => onFieldUpdate('leadSource', value)}
          />
        )}
        
        <EditableField
          label="Temperature"
          value={leadData.temperature}
          onSave={(value) => onFieldUpdate('temperature', value)}
          type="select"
          options={temperatureOptions}
        />

        {leadData.campaignId && (
          <EditableField
            label="Campaign"
            value={leadData.campaignId}
            onSave={(value) => onFieldUpdate('campaignId', value)}
          />
        )}
      </CardContent>
    </Card>
  );
}
