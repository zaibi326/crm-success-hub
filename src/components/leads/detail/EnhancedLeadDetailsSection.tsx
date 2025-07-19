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
  return <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <CollapsibleTrigger asChild>
          
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          
        </CollapsibleContent>
      </Card>
    </Collapsible>;
}