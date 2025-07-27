
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { InlineEditField } from './InlineEditField';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedActivityLogger } from '@/hooks/useEnhancedActivityLogger';

interface SellerContactSectionProps {
  lead: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: string) => void;
  canEdit?: boolean;
}

export function SellerContactSection({ lead, onFieldUpdate, canEdit = true }: SellerContactSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();
  const { logLeadActivity } = useEnhancedActivityLogger();

  const handleFieldChange = async (field: keyof TaxLead, value: string) => {
    if (canEdit) {
      try {
        const oldValue = lead[field];
        
        // Save immediately to backend
        await onFieldUpdate(field, value);
        
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
        throw error; // Re-throw to handle in InlineEditField
      }
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                Seller Contact Details
              </div>
              {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-6 pt-0">
            {!canEdit && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 text-amber-700 text-sm">
                You don't have permission to edit seller contact details.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InlineEditField
                label="First Name"
                value={lead.firstName || ''}
                onSave={(value) => handleFieldChange('firstName', value)}
                placeholder="Enter first name"
                required
                canEdit={canEdit}
              />

              <InlineEditField
                label="Last Name"
                value={lead.lastName || ''}
                onSave={(value) => handleFieldChange('lastName', value)}
                placeholder="Enter last name"
                required
                canEdit={canEdit}
              />

              <InlineEditField
                label="Seller Phone"
                value={lead.phone || ''}
                onSave={(value) => handleFieldChange('phone', value)}
                type="tel"
                placeholder="Enter phone number"
                canEdit={canEdit}
              />

              <InlineEditField
                label="Seller Email"
                value={lead.email || ''}
                onSave={(value) => handleFieldChange('email', value)}
                type="email"
                placeholder="Enter email address"
                canEdit={canEdit}
              />

              <div className="md:col-span-2">
                <InlineEditField
                  label="Seller Mailing Address"
                  value={lead.sellerMailingAddress || ''}
                  onSave={(value) => handleFieldChange('sellerMailingAddress', value)}
                  placeholder="Enter seller's mailing address"
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
