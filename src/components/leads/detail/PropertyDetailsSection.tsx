import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, ChevronDown, ChevronUp, MapPin, ExternalLink } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { InlineEditField } from './InlineEditField';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedActivityLogger } from '@/hooks/useEnhancedActivityLogger';

interface PropertyDetailsSectionProps {
  lead: TaxLead;
  onLeadUpdate: (field: keyof TaxLead, value: string) => void;
  canEdit?: boolean;
}

const occupancyOptions = [
  { value: 'OWNER_OCCUPIED', label: 'Owner Occupied' },
  { value: 'TENANT_OCCUPIED', label: 'Tenant Occupied' },
  { value: 'VACANT', label: 'Vacant' }
];

export function PropertyDetailsSection({ lead, onLeadUpdate, canEdit = true }: PropertyDetailsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();
  const { logLeadActivity } = useEnhancedActivityLogger();

  const handleFieldChange = async (field: keyof TaxLead, value: string) => {
    if (canEdit) {
      try {
        const oldValue = lead[field];
        
        // Save immediately to backend
        await onLeadUpdate(field, value);
        
        // Log each field change
        await logLeadActivity({
          actionType: 'updated',
          description: `Updated ${field} from "${oldValue}" to "${value}" for ${lead.ownerName || 'Unknown'}`,
          referenceId: lead.id.toString(),
          metadata: {
            leadId: lead.id,
            field: field,
            oldValue: oldValue,
            newValue: value,
            ownerName: lead.ownerName
          }
        });

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
        throw error;
      }
    }
  };

  const openZillowProperty = () => {
    if (lead.propertyAddress) {
      const encodedAddress = encodeURIComponent(lead.propertyAddress);
      window.open(`https://www.zillow.com/homes/${encodedAddress}/`, '_blank');
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
                  <Building className="w-4 h-4 text-green-600" />
                </div>
                Property Details
              </div>
              {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-6 pt-0">
            {!canEdit && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-amber-700 text-sm">
                You don't have permission to edit property details.
              </div>
            )}

            <div className="space-y-6">
              {/* Property Address - This is separate from Seller Contact Address */}
              <div className="space-y-4">
                <InlineEditField
                  label="Lead Property Address"
                  value={lead.propertyAddress || ''}
                  onSave={(value) => handleFieldChange('propertyAddress', value)}
                  required
                  canEdit={canEdit}
                />
                
                {/* Zillow Integration for Property Address */}
                {lead.propertyAddress && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Property Tools</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openZillowProperty}
                        className="flex items-center gap-1 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View on Zillow
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Other Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InlineEditField
                  label="Tax ID"
                  value={lead.taxId || ''}
                  onSave={(value) => handleFieldChange('taxId', value)}
                  canEdit={canEdit}
                />

                <InlineEditField
                  label="Occupancy Status"
                  value={lead.occupancyStatus || ''}
                  onSave={(value) => handleFieldChange('occupancyStatus', value)}
                  type="select"
                  options={occupancyOptions}
                  canEdit={canEdit}
                />

                <InlineEditField
                  label="Tax Lawsuit Number"
                  value={lead.taxLawsuitNumber || ''}
                  onSave={(value) => handleFieldChange('taxLawsuitNumber', value)}
                  canEdit={canEdit}
                />

                <InlineEditField
                  label="Current Arrears"
                  value={lead.currentArrears?.toString() || ''}
                  onSave={(value) => handleFieldChange('currentArrears', value)}
                  type="number"
                  canEdit={canEdit}
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
