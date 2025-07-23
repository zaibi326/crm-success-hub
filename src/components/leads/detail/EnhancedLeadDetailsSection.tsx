
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
          <CardHeader className="hover:bg-gray-50 cursor-pointer transition-colors">
            <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                Lead Details
              </div>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lead Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Lead Status</label>
                <InlineEditField
                  value={lead.status || ''}
                  onSave={(value) => handleFieldUpdate('status', value)}
                  type="select"
                  options={leadStatusOptions}
                  canEdit={canEdit}
                  placeholder="Select lead status"
                />
              </div>

              {/* Property Value */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Property Value</label>
                <InlineEditField
                  value={formatCurrency(lead.propertyValue)}
                  onSave={(value) => handleCurrencyUpdate('propertyValue', value)}
                  canEdit={canEdit}
                  placeholder="Enter property value"
                />
              </div>

              {/* Tax Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tax Amount</label>
                <InlineEditField
                  value={formatCurrency(lead.taxAmount)}
                  onSave={(value) => handleCurrencyUpdate('taxAmount', value)}
                  canEdit={canEdit}
                  placeholder="Enter tax amount"
                />
              </div>

              {/* Occupancy Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Occupancy Status</label>
                <InlineEditField
                  value={lead.occupancyStatus || ''}
                  onSave={(value) => handleFieldUpdate('occupancyStatus', value)}
                  type="select"
                  options={occupancyOptions}
                  canEdit={canEdit}
                  placeholder="Select occupancy status"
                />
              </div>

              {/* County */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">County</label>
                <InlineEditField
                  value={lead.county || ''}
                  onSave={(value) => handleFieldUpdate('county', value)}
                  canEdit={canEdit}
                  placeholder="Enter county"
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">State</label>
                <InlineEditField
                  value={lead.state || ''}
                  onSave={(value) => handleFieldUpdate('state', value)}
                  canEdit={canEdit}
                  placeholder="Enter state"
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
