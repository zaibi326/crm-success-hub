
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import { EditableField } from '../EditableField';
import { TaxLead } from '@/types/taxLead';

interface PropertyInfoSectionProps {
  leadData: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: string) => void;
}

export function PropertyInfoSection({ leadData, onFieldUpdate }: PropertyInfoSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Home className="w-5 h-5 text-crm-primary" />
          Property Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <EditableField
          label="Property Address"
          value={leadData.propertyAddress || ''}
          onSave={(value) => onFieldUpdate('propertyAddress', value)}
        />
        
        <EditableField
          label="Property Value"
          value={leadData.propertyValue ? leadData.propertyValue.toString() : ''}
          onSave={(value) => onFieldUpdate('propertyValue', value)}
        />
        
        <EditableField
          label="Property Type"
          value={leadData.propertyType || ''}
          onSave={(value) => onFieldUpdate('propertyType', value)}
        />
        
        <EditableField
          label="Year Built"
          value={leadData.yearBuilt || ''}
          onSave={(value) => onFieldUpdate('yearBuilt', value)}
        />
        
        <EditableField
          label="Square Footage"
          value={leadData.squareFootage || ''}
          onSave={(value) => onFieldUpdate('squareFootage', value)}
        />
        
        <EditableField
          label="Lot Size"
          value={leadData.lotSize || ''}
          onSave={(value) => onFieldUpdate('lotSize', value)}
        />
      </CardContent>
    </Card>
  );
}
