
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { EditableField } from '../EditableField';
import { TaxLead } from '@/types/taxLead';

interface PersonalInfoSectionProps {
  leadData: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: string) => void;
}

export function PersonalInfoSection({ leadData, onFieldUpdate }: PersonalInfoSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-crm-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditableField
          label="Owner Name"
          value={leadData.ownerName || ''}
          onSave={(value) => onFieldUpdate('ownerName', value)}
        />
        
        <EditableField
          label="First Name"
          value={leadData.firstName || ''}
          onSave={(value) => onFieldUpdate('firstName', value)}
        />
        
        <EditableField
          label="Last Name"
          value={leadData.lastName || ''}
          onSave={(value) => onFieldUpdate('lastName', value)}
        />
        
        {leadData.phone && (
          <EditableField
            label="Phone"
            value={leadData.phone}
            onSave={(value) => onFieldUpdate('phone', value)}
            type="tel"
          />
        )}
        
        {leadData.email && (
          <EditableField
            label="Email"
            value={leadData.email}
            onSave={(value) => onFieldUpdate('email', value)}
            type="email"
          />
        )}

        {leadData.agentName && (
          <EditableField
            label="Agent"
            value={leadData.agentName}
            onSave={(value) => onFieldUpdate('agentName', value)}
          />
        )}
      </CardContent>
    </Card>
  );
}
