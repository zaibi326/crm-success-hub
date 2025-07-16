
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { InlineEditField } from './InlineEditField';

interface EnhancedLeadDetailsSectionProps {
  lead: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: string) => void;
  canEdit?: boolean;
}

const leadStatusOptions = [
  { value: 'HOT', label: 'Hot Lead' },
  { value: 'WARM', label: 'Warm Lead' },
  { value: 'COLD', label: 'Cold Lead' },
];

const occupancyOptions = [
  { value: 'OWNER_OCCUPIED', label: 'Owner Occupied' },
  { value: 'TENANT_OCCUPIED', label: 'Tenant Occupied' },
  { value: 'VACANT', label: 'Vacant' },
  { value: 'UNKNOWN', label: 'Unknown' },
];

export function EnhancedLeadDetailsSection({ 
  lead, 
  onFieldUpdate, 
  canEdit = true 
}: EnhancedLeadDetailsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleFieldUpdate = (field: keyof TaxLead, value: string) => {
    if (canEdit) {
      onFieldUpdate(field, value);
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return '';
    return amount.toString();
  };

  const handleCurrencyUpdate = (field: keyof TaxLead, value: string) => {
    const numValue = parseFloat(value.replace(/[$,]/g, ''));
    if (!isNaN(numValue)) {
      onFieldUpdate(field, numValue.toString());
    } else if (value === '') {
      onFieldUpdate(field, '');
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                Lead Details
              </div>
              {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-6 pt-0">
            {!canEdit && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-amber-700 text-sm">
                You don't have permission to edit lead details.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InlineEditField
                label="Lead Status"
                value={lead.status}
                onSave={(value) => handleFieldUpdate('status', value)}
                type="select"
                options={leadStatusOptions}
              />

              <InlineEditField
                label="Tax ID"
                value={lead.taxId}
                onSave={(value) => handleFieldUpdate('taxId', value)}
                placeholder="Enter tax ID"
              />

              <InlineEditField
                label="Occupancy Status"
                value={lead.occupancyStatus}
                onSave={(value) => handleFieldUpdate('occupancyStatus', value)}
                type="select"
                options={occupancyOptions}
              />

              <InlineEditField
                label="Lead Source"
                value={lead.leadSource}
                onSave={(value) => handleFieldUpdate('leadSource', value)}
                placeholder="Enter lead source"
              />

              <InlineEditField
                label="Current Arrears ($)"
                value={formatCurrency(lead.currentArrears)}
                onSave={(value) => handleCurrencyUpdate('currentArrears', value)}
                type="number"
                placeholder="0.00"
              />

              <InlineEditField
                label="Asking Price ($)"
                value={formatCurrency(lead.askingPrice)}
                onSave={(value) => handleCurrencyUpdate('askingPrice', value)}
                type="number"
                placeholder="0.00"
              />

              <InlineEditField
                label="Mortgage Price ($)"
                value={formatCurrency(lead.mortgagePrice)}
                onSave={(value) => handleCurrencyUpdate('mortgagePrice', value)}
                type="number"
                placeholder="0.00"
              />

              <InlineEditField
                label="Agent Name"
                value={lead.agentName}
                onSave={(value) => handleFieldUpdate('agentName', value)}
                placeholder="Enter agent name"
              />

              <div className="md:col-span-2">
                <InlineEditField
                  label="Notes"
                  value={lead.notes}
                  onSave={(value) => handleFieldUpdate('notes', value)}
                  type="textarea"
                  placeholder="Add notes about this lead..."
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
