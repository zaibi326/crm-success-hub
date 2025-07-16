
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  propertyAddress: string;
  leadSource: string;
  temperature: 'HOT' | 'WARM' | 'COLD';
  occupancyStatus: 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'VACANT';
  agentName: string;
  notes: string;
  askingPrice: string;
  mortgagePrice: string;
  currentArrears: string;
  taxId: string;
  campaignId: string;
  attachedFiles: File[];
}

interface AddSellerFormProps {
  formData: FormData;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: string | File[]) => void;
}

export function AddSellerForm({ formData, errors, onFieldChange }: AddSellerFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => onFieldChange('firstName', e.target.value)}
            placeholder="Enter first name"
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onFieldChange('lastName', e.target.value)}
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyAddress">Property Address *</Label>
        <Input
          id="propertyAddress"
          value={formData.propertyAddress}
          onChange={(e) => onFieldChange('propertyAddress', e.target.value)}
          placeholder="Enter property address"
          className={errors.propertyAddress ? 'border-red-500' : ''}
        />
        {errors.propertyAddress && <span className="text-red-500 text-sm">{errors.propertyAddress}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onFieldChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="temperature">Lead Status</Label>
          <Select value={formData.temperature} onValueChange={(value) => onFieldChange('temperature', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select lead status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOT">Hot Lead</SelectItem>
              <SelectItem value="WARM">Warm Lead</SelectItem>
              <SelectItem value="COLD">Cold Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupancyStatus">Occupancy Status</Label>
          <Select value={formData.occupancyStatus} onValueChange={(value) => onFieldChange('occupancyStatus', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select occupancy status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OWNER_OCCUPIED">Owner Occupied</SelectItem>
              <SelectItem value="TENANT_OCCUPIED">Tenant Occupied</SelectItem>
              <SelectItem value="VACANT">Vacant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onFieldChange('notes', e.target.value)}
          placeholder="Add any additional notes..."
          rows={3}
        />
      </div>
    </div>
  );
}
