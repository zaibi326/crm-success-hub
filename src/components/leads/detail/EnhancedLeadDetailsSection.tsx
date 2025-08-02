
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

const leadStatusOptions = [{
  value: 'HOT',
  label: 'Hot Lead'
}, {
  value: 'WARM',
  label: 'Warm Lead'
}, {
  value: 'COLD',
  label: 'Cold Lead'
}, {
  value: 'PASS',
  label: 'Pass'
}, {
  value: 'KEEP',
  label: 'Keep'
}];

const occupancyOptions = [{
  value: 'OWNER_OCCUPIED',
  label: 'Owner Occupied'
}, {
  value: 'TENANT_OCCUPIED',
  label: 'Tenant Occupied'
}, {
  value: 'VACANT',
  label: 'Vacant'
}, {
  value: 'UNKNOWN',
  label: 'Unknown'
}];

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
    <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
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
                label="Tax ID"
                value={lead.taxId || ''}
                onSave={(value) => handleFieldUpdate('taxId', value)}
                placeholder="Enter tax ID"
                required
                canEdit={canEdit}
              />

              <InlineEditField
                label="Owner Name"
                value={lead.ownerName || ''}
                onSave={(value) => handleFieldUpdate('ownerName', value)}
                placeholder="Enter owner name"
                required
                canEdit={canEdit}
              />

              <InlineEditField
                label="Tax Lawsuit Number"
                value={lead.taxLawsuitNumber || ''}
                onSave={(value) => handleFieldUpdate('taxLawsuitNumber', value)}
                placeholder="Enter lawsuit number"
                canEdit={canEdit}
              />

              <InlineEditField
                label="Lead Status"
                value={lead.status || ''}
                onSave={(value) => handleFieldUpdate('status', value)}
                type="select"
                options={leadStatusOptions}
                canEdit={canEdit}
              />

              <InlineEditField
                label="Occupancy Status"
                value={lead.occupancyStatus || ''}
                onSave={(value) => handleFieldUpdate('occupancyStatus', value)}
                type="select"
                options={occupancyOptions}
                canEdit={canEdit}
              />

              <InlineEditField
                label="Current Arrears"
                value={formatCurrency(lead.currentArrears)}
                onSave={(value) => handleCurrencyUpdate('currentArrears', value)}
                placeholder="Enter amount"
                canEdit={canEdit}
              />

              <InlineEditField
                label="Property Value"
                value={formatCurrency(lead.propertyValue)}
                onSave={(value) => handleCurrencyUpdate('propertyValue', value)}
                placeholder="Enter property value"
                canEdit={canEdit}
              />

              <InlineEditField
                label="Asking Price"
                value={formatCurrency(lead.askingPrice)}
                onSave={(value) => handleCurrencyUpdate('askingPrice', value)}
                placeholder="Enter asking price"
                canEdit={canEdit}
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
