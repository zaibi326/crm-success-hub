
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { InlineEditField } from './InlineEditField';

interface EnhancedSellerContactSectionProps {
  lead: TaxLead;
  onFieldUpdate: (field: keyof TaxLead, value: string) => void;
  canEdit?: boolean;
}

const statusCards = [
  { value: 'HOT', label: 'Hot', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-500' },
  { value: 'WARM', label: 'Warm', color: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-500' },
  { value: 'COLD', label: 'Cold', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-500' }
];

export function EnhancedSellerContactSection({ lead, onFieldUpdate, canEdit = true }: EnhancedSellerContactSectionProps) {
  const handleFieldUpdate = (field: keyof TaxLead, value: string) => {
    if (canEdit) {
      onFieldUpdate(field, value);
    }
  };

  const handleStatusChange = (status: string) => {
    if (canEdit) {
      onFieldUpdate('status', status);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <User className="w-6 h-6 text-blue-600" />
          Seller Contact Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Basic Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InlineEditField
            label="Owner Name"
            value={lead.ownerName}
            onSave={(value) => handleFieldUpdate('ownerName', value)}
            placeholder="Enter owner name"
            required
          />

          <InlineEditField
            label="Tax ID"
            value={lead.taxId}
            onSave={(value) => handleFieldUpdate('taxId', value)}
            placeholder="Enter tax ID"
          />

          <InlineEditField
            label="Phone Number"
            value={lead.phone}
            onSave={(value) => handleFieldUpdate('phone', value)}
            type="tel"
            placeholder="Enter phone number"
          />

          <InlineEditField
            label="Email Address"
            value={lead.email}
            onSave={(value) => handleFieldUpdate('email', value)}
            type="email"
            placeholder="Enter email address"
          />
        </div>

        {/* Lead Status Cards */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Lead Status</label>
          <div className="flex gap-3 flex-wrap">
            {statusCards.map((status) => {
              const isActive = lead.status === status.value;
              return (
                <div
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200
                    ${isActive 
                      ? `${status.bgColor} ${status.borderColor} border-2 ${status.textColor} shadow-md` 
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }
                    ${!canEdit ? 'cursor-not-allowed opacity-50' : 'hover:shadow-md'}
                  `}
                >
                  <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                  <span className="font-medium">{status.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Property Address with Map */}
        <div className="space-y-4">
          <InlineEditField
            label="Property Address"
            value={lead.propertyAddress}
            onSave={(value) => handleFieldUpdate('propertyAddress', value)}
            placeholder="Enter property address"
            required
          />
          
          {/* Zillow Map Widget */}
          {lead.propertyAddress && (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Property Location</span>
              </div>
              <div className="bg-white rounded border h-64 flex items-center justify-center">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(lead.propertyAddress)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '4px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location"
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                Map preview for: {lead.propertyAddress}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
