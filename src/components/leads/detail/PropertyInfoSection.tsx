
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ExternalLink } from 'lucide-react';
import { EditableField } from '../EditableField';
import { TaxLead } from '@/types/taxLead';

interface PropertyInfoSectionProps {
  leadData: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: string) => void;
}

const occupancyOptions = [
  { value: 'OWNER_OCCUPIED', label: 'Owner Occupied' },
  { value: 'TENANT_OCCUPIED', label: 'Tenant Occupied' },
  { value: 'VACANT', label: 'Vacant' },
  { value: 'UNKNOWN', label: 'Unknown' }
];

export function PropertyInfoSection({ leadData, onFieldUpdate }: PropertyInfoSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5 text-crm-primary" />
          Property Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditableField
          label="Address"
          value={leadData.propertyAddress}
          onSave={(value) => onFieldUpdate('propertyAddress', value)}
        />
        
        <EditableField
          label="Occupancy"
          value={leadData.occupancyStatus}
          onSave={(value) => onFieldUpdate('occupancyStatus', value)}
          type="select"
          options={occupancyOptions}
        />

        {leadData.taxId && (
          <EditableField
            label="Tax ID"
            value={leadData.taxId}
            onSave={(value) => onFieldUpdate('taxId', value)}
          />
        )}

        {/* Property Links */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="font-medium text-gray-700">Quick Links</div>
          <div className="col-span-2 flex gap-2">
            <Button
              variant="link"
              className="p-0 h-auto text-crm-primary hover:text-crm-accent"
              onClick={() => window.open(`https://www.zillow.com/homes/${encodeURIComponent(leadData.propertyAddress)}/`, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Zillow
            </Button>
            <Button
              variant="link"
              className="p-0 h-auto text-crm-primary hover:text-crm-accent"
              onClick={() => window.open(`https://www.homes.com/property/${encodeURIComponent(leadData.propertyAddress)}/`, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Homes.com
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
