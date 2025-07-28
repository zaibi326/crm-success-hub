
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ExternalLink, MapPin, Home, Search, DollarSign } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { InlineEditField } from './InlineEditField';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleFieldChange = async (field: keyof TaxLead, value: string) => {
    if (canEdit) {
      try {
        await onFieldUpdate(field, value);
        toast({
          title: "✅ Field Updated",
          description: `${field} has been updated successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to update ${field}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleStatusChange = async (status: string) => {
    if (canEdit) {
      try {
        await onFieldUpdate('status', status);
        toast({
          title: "✅ Status Updated",
          description: `Status changed to ${status}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive",
        });
      }
    }
  };

  const openZillowProperty = () => {
    const address = lead.propertyAddress;
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.zillow.com/homes/${encodedAddress}/`, '_blank');
    }
  };

  const openZillowComps = () => {
    const address = lead.propertyAddress;
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.zillow.com/homes/comps/${encodedAddress}/`, '_blank');
    }
  };

  const openZillowRentEstimate = () => {
    const address = lead.propertyAddress;
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.zillow.com/rental-manager/price-my-rental/${encodedAddress}/`, '_blank');
    }
  };

  const searchNearbyProperties = () => {
    const address = lead.propertyAddress;
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.zillow.com/homes/for_sale/${encodedAddress}/`, '_blank');
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <User className="w-6 h-6 text-blue-600" />
          Lead Details & Property Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Basic Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InlineEditField
            label="Owner Name"
            value={lead.ownerName || ''}
            onSave={(value) => handleFieldChange('ownerName', value)}
            required
            canEdit={canEdit}
          />

          <InlineEditField
            label="Tax ID"
            value={lead.taxId || ''}
            onSave={(value) => handleFieldChange('taxId', value)}
            canEdit={canEdit}
          />

          <InlineEditField
            label="Phone Number"
            value={lead.phone || ''}
            onSave={(value) => handleFieldChange('phone', value)}
            type="tel"
            canEdit={canEdit}
          />

          <InlineEditField
            label="Email Address"
            value={lead.email || ''}
            onSave={(value) => handleFieldChange('email', value)}
            type="email"
            canEdit={canEdit}
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

        {/* Enhanced Property Address with Zillow Integration */}
        <div className="space-y-4">
          <InlineEditField
            label="Property Address"
            value={lead.propertyAddress || ''}
            onSave={(value) => handleFieldChange('propertyAddress', value)}
            required
            canEdit={canEdit}
          />
          
          {/* Enhanced Zillow Integration Panel */}
          {lead.propertyAddress && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-base font-semibold text-blue-900">Zillow Property Intelligence</span>
              </div>
              
              {/* Property Analysis Tools */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <Button
                  onClick={openZillowProperty}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="text-xs">View Property</span>
                </Button>
                
                <Button
                  onClick={openZillowComps}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span className="text-xs">Comparables</span>
                </Button>
                
                <Button
                  onClick={openZillowRentEstimate}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs">Rent Estimate</span>
                </Button>
                
                <Button
                  onClick={searchNearbyProperties}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-orange-50 hover:border-orange-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-xs">Nearby Sales</span>
                </Button>
              </div>
              
              {/* Property Preview */}
              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Property Preview</span>
                  </div>
                  <Button
                    onClick={openZillowProperty}
                    variant="link"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open in Zillow
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Address: <span className="font-medium text-gray-900">{lead.propertyAddress}</span>
                  </div>
                  <div className="text-xs text-blue-600 break-all">
                    Zillow URL: https://www.zillow.com/homes/{encodeURIComponent(lead.propertyAddress)}/
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
