
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ChevronDown, ChevronUp, Save } from 'lucide-react';
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
  const [hasChanges, setHasChanges] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Partial<TaxLead>>({});
  const { toast } = useToast();
  const { logLeadActivity } = useEnhancedActivityLogger();

  const handleFieldChange = (field: keyof TaxLead, value: string) => {
    if (canEdit) {
      // Store pending changes without immediately saving
      setPendingChanges(prev => ({
        ...prev,
        [field]: value
      }));
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    if (!hasChanges || !canEdit) return;

    try {
      // Apply all pending changes
      for (const [field, value] of Object.entries(pendingChanges)) {
        const oldValue = lead[field as keyof TaxLead];
        onFieldUpdate(field as keyof TaxLead, value as string);
        
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
      }

      // Clear pending changes
      setPendingChanges({});
      setHasChanges(false);

      toast({
        title: "Success",
        description: "✅ Seller Contact updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setPendingChanges({});
    setHasChanges(false);
  };

  // Show current values with pending changes overlaid
  const getCurrentValue = (field: keyof TaxLead) => {
    return pendingChanges[field] !== undefined ? pendingChanges[field] as string : (lead[field] as string || '');
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
                {hasChanges && (
                  <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    Unsaved changes
                  </span>
                )}
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
                value={getCurrentValue('firstName')}
                onSave={(value) => handleFieldChange('firstName', value)}
                placeholder="Enter first name"
                required
                canEdit={canEdit}
              />

              <InlineEditField
                label="Last Name"
                value={getCurrentValue('lastName')}
                onSave={(value) => handleFieldChange('lastName', value)}
                placeholder="Enter last name"
                required
                canEdit={canEdit}
              />

              <InlineEditField
                label="Seller Phone"
                value={getCurrentValue('phone')}
                onSave={(value) => handleFieldChange('phone', value)}
                type="tel"
                placeholder="Enter phone number"
                canEdit={canEdit}
              />

              <InlineEditField
                label="Seller Email"
                value={getCurrentValue('email')}
                onSave={(value) => handleFieldChange('email', value)}
                type="email"
                placeholder="Enter email address"
                canEdit={canEdit}
              />

              <div className="md:col-span-2">
                <InlineEditField
                  label="Property Address"
                  value={getCurrentValue('propertyAddress')}
                  onSave={(value) => handleFieldChange('propertyAddress', value)}
                  placeholder="Enter property address"
                  required
                  canEdit={canEdit}
                />
              </div>
            </div>

            {/* Save/Cancel buttons - only show when there are changes */}
            {hasChanges && canEdit && (
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
