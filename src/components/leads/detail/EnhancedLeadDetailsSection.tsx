
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ChevronDown, ChevronUp, MapPin, ExternalLink } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { InlineEditField } from './InlineEditField';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleFieldUpdate = async (field: keyof TaxLead, value: string) => {
    if (canEdit) {
      try {
        await onFieldUpdate(field, value);
        toast({
          title: "Success",
          description: `✅ ${field} updated successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to update ${field}`,
          variant: "destructive",
        });
      }
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

  const openZillow = () => {
    const address = lead.propertyAddress;
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.zillow.com/homes/${encodedAddress}/`, '_blank');
    }
  };

  const formatZillowUrl = (address: string) => {
    if (!address) return '';
    const encodedAddress = encodeURIComponent(address);
    return `https://www.zillow.com/homes/${encodedAddress}/`;
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
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
                value={lead.status || 'COLD'}
                onSave={(value) => handleFieldUpdate('status', value)}
                type="select"
                options={leadStatusOptions}
                canEdit={canEdit}
              />

              <InlineEditField
                label="Temperature"
                value={lead.temperature || 'COLD'}
                onSave={(value) => handleFieldUpdate('temperature', value)}
                type="select"
                options={leadStatusOptions}
                canEdit={canEdit}
              />

              <InlineEditField
                label="Occupancy Status"
                value={lead.occupancyStatus || 'OWNER_OCCUPIED'}
                onSave={(value) => handleFieldUpdate('occupancyStatus', value)}
                type="select"
                options={occupancyOptions}
                canEdit={canEdit}
              />

              <InlineEditField
                label="Tax ID"
                value={lead.taxId || ''}
                onSave={(value) => handleFieldUpdate('taxId', value)}
                placeholder="Enter tax ID"
                canEdit={canEdit}
              />

              <InlineEditField
                label="Current Arrears"
                value={formatCurrency(lead.currentArrears)}
                onSave={(value) => handleCurrencyUpdate('currentArrears', value)}
                type="number"
                placeholder="Enter amount"
                canEdit={canEdit}
              />

              <InlineEditField
                label="Asking Price"
                value={formatCurrency(lead.askingPrice)}
                onSave={(value) => handleCurrencyUpdate('askingPrice', value)}
                type="number"
                placeholder="Enter amount"
                canEdit={canEdit}
              />

              <div className="md:col-span-2">
                <InlineEditField
                  label="Property Address"
                  value={lead.propertyAddress || ''}
                  onSave={(value) => handleFieldUpdate('propertyAddress', value)}
                  placeholder="Enter property address"
                  required
                  canEdit={canEdit}
                />
              </div>

              {/* Zillow Integration */}
              {lead.propertyAddress && (
                <div className="md:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Property Preview
                      </span>
                      <Button
                        onClick={openZillow}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Zillow
                      </Button>
                    </div>
                    
                    <div className="bg-white rounded border p-4 space-y-2">
                      <div className="text-sm text-gray-600">
                        Property location: <span className="font-medium text-gray-900">{lead.propertyAddress}</span>
                      </div>
                      <div className="text-xs text-blue-600 break-all">
                        {formatZillowUrl(lead.propertyAddress)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
