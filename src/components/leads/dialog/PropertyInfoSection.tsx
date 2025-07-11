
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PropertyInfoSectionProps {
  propertyAddress: string;
  occupancyStatus: 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'VACANT';
  taxId: string;
  onInputChange: (field: string, value: string) => void;
}

export function PropertyInfoSection({ propertyAddress, occupancyStatus, taxId, onInputChange }: PropertyInfoSectionProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">Property Information</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="propertyAddress" className="w-24 text-right font-medium">
            Property Address *
          </Label>
          <Input
            id="propertyAddress"
            value={propertyAddress}
            onChange={(e) => onInputChange('propertyAddress', e.target.value)}
            placeholder="Enter full property address"
            className="flex-1"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <Label htmlFor="occupancyStatus" className="w-24 text-right font-medium">
            Occupancy Status
          </Label>
          <Select value={occupancyStatus} onValueChange={(value) => onInputChange('occupancyStatus', value)}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select occupancy status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OWNER_OCCUPIED">Owner Occupied</SelectItem>
              <SelectItem value="TENANT_OCCUPIED">Tenant Occupied</SelectItem>
              <SelectItem value="VACANT">Vacant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <Label htmlFor="taxId" className="w-24 text-right font-medium">
            Tax ID
          </Label>
          <Input
            id="taxId"
            value={taxId}
            onChange={(e) => onInputChange('taxId', e.target.value)}
            placeholder="TX123456789"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
