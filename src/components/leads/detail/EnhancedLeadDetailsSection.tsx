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
  const {
    toast
  } = useToast();
  const handleFieldUpdate = async (field: keyof TaxLead, value: string) => {
    if (canEdit) {
      try {
        await onFieldUpdate(field, value);
        toast({
          title: "Success",
          description: `✅ ${field} updated successfully`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to update ${field}`,
          variant: "destructive"
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
  return <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          
        </CollapsibleContent>
      </Collapsible>
    </Card>;
}