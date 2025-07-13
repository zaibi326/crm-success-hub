
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { EditableField } from '../EditableField';
import { TaxLead } from '@/types/taxLead';

interface FinancialInfoSectionProps {
  leadData: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: string) => void;
}

export function FinancialInfoSection({ leadData, onFieldUpdate }: FinancialInfoSectionProps) {
  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'N/A';
    return `$${amount.toLocaleString()}`;
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-crm-primary" />
          Financial Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {leadData.askingPrice && (
          <EditableField
            label="Asking Price"
            value={formatCurrency(leadData.askingPrice)}
            onSave={(value) => {
              const numValue = parseFloat(value.replace(/[$,]/g, ''));
              if (!isNaN(numValue)) {
                onFieldUpdate('askingPrice', numValue.toString());
              }
            }}
          />
        )}
        
        {leadData.mortgagePrice && (
          <EditableField
            label="Mortgage Price"
            value={formatCurrency(leadData.mortgagePrice)}
            onSave={(value) => {
              const numValue = parseFloat(value.replace(/[$,]/g, ''));
              if (!isNaN(numValue)) {
                onFieldUpdate('mortgagePrice', numValue.toString());
              }
            }}
          />
        )}
        
        {leadData.currentArrears && (
          <EditableField
            label="Current Arrears"
            value={formatCurrency(leadData.currentArrears)}
            onSave={(value) => {
              const numValue = parseFloat(value.replace(/[$,]/g, ''));
              if (!isNaN(numValue)) {
                onFieldUpdate('currentArrears', numValue.toString());
              }
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
