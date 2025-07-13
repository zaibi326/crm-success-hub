
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, User } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface EditableLeadInfoSectionProps {
  formData: TaxLead;
  onInputChange: (field: keyof TaxLead, value: any) => void;
  canEdit: boolean;
}

export function EditableLeadInfoSection({ 
  formData, 
  onInputChange, 
  canEdit 
}: EditableLeadInfoSectionProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-crm-primary/10 to-crm-accent/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <User className="w-6 h-6 text-crm-primary" />
          Lead Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Owner Name */}
          <div className="space-y-2">
            <Label htmlFor="ownerName" className="text-sm font-medium text-gray-700">
              Owner Name *
            </Label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e) => onInputChange('ownerName', e.target.value)}
              placeholder="Enter owner name"
              disabled={!canEdit}
              className="border-gray-200 focus:border-crm-primary focus:ring-crm-primary/20"
            />
          </div>

          {/* Tax ID */}
          <div className="space-y-2">
            <Label htmlFor="taxId" className="text-sm font-medium text-gray-700">
              Tax ID *
            </Label>
            <Input
              id="taxId"
              value={formData.taxId}
              onChange={(e) => onInputChange('taxId', e.target.value)}
              placeholder="Enter tax ID"
              disabled={!canEdit}
              className="font-mono border-gray-200 focus:border-crm-primary focus:ring-crm-primary/20"
            />
          </div>

          {/* Property Address */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="propertyAddress" className="text-sm font-medium text-gray-700">
              Property Address *
            </Label>
            <Input
              id="propertyAddress"
              value={formData.propertyAddress}
              onChange={(e) => onInputChange('propertyAddress', e.target.value)}
              placeholder="Enter complete property address"
              disabled={!canEdit}
              className="border-gray-200 focus:border-crm-primary focus:ring-crm-primary/20"
            />
          </div>

          {/* Lawsuit Number */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="taxLawsuitNumber" className="text-sm font-medium text-gray-700">
              Tax Lawsuit Number
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="taxLawsuitNumber"
                value={formData.taxLawsuitNumber || ''}
                onChange={(e) => onInputChange('taxLawsuitNumber', e.target.value)}
                placeholder="Enter tax lawsuit number (if applicable)"
                disabled={!canEdit}
                className="pl-10 font-mono border-gray-200 focus:border-crm-primary focus:ring-crm-primary/20"
              />
            </div>
          </div>
        </div>

        {!canEdit && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              These fields are read-only. Contact your administrator to request edit permissions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
