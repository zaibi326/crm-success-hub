
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { InlineEditField } from './InlineEditField';

interface SellerContactSectionProps {
  lead: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: string) => void;
  canEdit?: boolean;
}

export function SellerContactSection({ lead, onFieldUpdate, canEdit = true }: SellerContactSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleFieldUpdate = (field: keyof TaxLead, value: string) => {
    if (canEdit) {
      onFieldUpdate(field, value);
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
                value={lead.firstName}
                onSave={(value) => handleFieldUpdate('firstName', value)}
                placeholder="Enter first name"
                required
              />

              <InlineEditField
                label="Last Name"
                value={lead.lastName}
                onSave={(value) => handleFieldUpdate('lastName', value)}
                placeholder="Enter last name"
                required
              />

              <InlineEditField
                label="Seller Phone"
                value={lead.phone}
                onSave={(value) => handleFieldUpdate('phone', value)}
                type="tel"
                placeholder="Enter phone number"
              />

              <InlineEditField
                label="Seller Email"
                value={lead.email}
                onSave={(value) => handleFieldUpdate('email', value)}
                type="email"
                placeholder="Enter email address"
              />

              <div className="md:col-span-2">
                <InlineEditField
                  label="Property Address"
                  value={lead.propertyAddress}
                  onSave={(value) => handleFieldUpdate('propertyAddress', value)}
                  placeholder="Enter property address"
                  required
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
