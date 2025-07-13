
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface EditableFieldsSectionProps {
  formData: TaxLead;
  onInputChange: (field: keyof TaxLead, value: any) => void;
  canEdit: boolean;
}

export function EditableFieldsSection({ 
  formData, 
  onInputChange, 
  canEdit 
}: EditableFieldsSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-crm-primary" />
          Editable Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentArrears">Current Arrears ($)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="currentArrears"
              type="number"
              value={formData.currentArrears || ''}
              onChange={(e) => onInputChange('currentArrears', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="pl-10"
              disabled={!canEdit}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerOfRecord">Owner of Record</Label>
          <Input
            id="ownerOfRecord"
            value={formData.ownerOfRecord || ''}
            onChange={(e) => onInputChange('ownerOfRecord', e.target.value)}
            placeholder="Enter owner of record"
            disabled={!canEdit}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="propertyAddressEdit">Property Address (Editable)</Label>
          <Input
            id="propertyAddressEdit"
            value={formData.propertyAddress}
            onChange={(e) => onInputChange('propertyAddress', e.target.value)}
            placeholder="Enter complete property address"
            disabled={!canEdit}
          />
        </div>
      </CardContent>
    </Card>
  );
}
