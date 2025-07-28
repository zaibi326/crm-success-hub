
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ExternalLink, MapPin, Search } from 'lucide-react';
import { EditableField } from '../EditableField';
import { TaxLead } from '@/types/taxLead';
import { ZillowMap } from '../ZillowMap';

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
  const [showMap, setShowMap] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  // Add null check for leadData
  if (!leadData) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5 text-crm-primary" />
            Property Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading property information...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAddressUpdate = (value: string) => {
    onFieldUpdate('propertyAddress', value);
    // Refresh map when address changes
    setMapKey(prev => prev + 1);
  };

  const openZillowProperty = () => {
    if (leadData.propertyAddress) {
      const encodedAddress = encodeURIComponent(leadData.propertyAddress);
      window.open(`https://www.zillow.com/homes/${encodedAddress}/`, '_blank');
    }
  };

  const searchZillowMarket = () => {
    if (leadData.propertyAddress) {
      const encodedAddress = encodeURIComponent(leadData.propertyAddress);
      window.open(`https://www.zillow.com/homes/for_sale/${encodedAddress}/`, '_blank');
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5 text-crm-primary" />
          Property Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Address with Map Integration */}
        <div className="space-y-4">
          <EditableField
            label="Property Address"
            value={leadData.propertyAddress || ''}
            onSave={handleAddressUpdate}
          />
          
          {/* Zillow Integration Controls */}
          {leadData.propertyAddress && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Zillow Property Tools</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMap(!showMap)}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  {showMap ? 'Hide Map' : 'Show Map'}
                </Button>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openZillowProperty}
                  className="flex items-center gap-1 hover:bg-blue-50 hover:border-blue-300"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Property
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={searchZillowMarket}
                  className="flex items-center gap-1 hover:bg-green-50 hover:border-green-300"
                >
                  <Search className="w-3 h-3" />
                  Market Search
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://www.zillow.com/rental-manager/price-my-rental/${encodeURIComponent(leadData.propertyAddress)}/`, '_blank')}
                  className="flex items-center gap-1 hover:bg-purple-50 hover:border-purple-300"
                >
                  <ExternalLink className="w-3 h-3" />
                  Rent Estimate
                </Button>
              </div>
            </div>
          )}

          {/* Interactive Zillow Map */}
          {showMap && leadData.propertyAddress && (
            <div className="mt-4">
              <ZillowMap 
                key={mapKey}
                address={leadData.propertyAddress}
                className="border border-gray-200 rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Other Property Fields */}
        <EditableField
          label="Occupancy Status"
          value={leadData.occupancyStatus || ''}
          onSave={(value) => onFieldUpdate('occupancyStatus', value)}
          type="select"
          options={occupancyOptions}
        />

        {leadData.taxId && (
          <EditableField
            label="Tax ID"
            value={leadData.taxId || ''}
            onSave={(value) => onFieldUpdate('taxId', value)}
          />
        )}

        {/* Enhanced Property Links */}
        <div className="border-t pt-4">
          <div className="text-sm font-medium text-gray-700 mb-3">Additional Property Resources</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="link"
              className="p-0 h-auto text-crm-primary hover:text-crm-accent justify-start"
              onClick={() => window.open(`https://www.homes.com/property/${encodeURIComponent(leadData.propertyAddress || '')}/`, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Homes.com
            </Button>
            <Button
              variant="link"
              className="p-0 h-auto text-crm-primary hover:text-crm-accent justify-start"
              onClick={() => window.open(`https://www.redfin.com/stingray/do/location-search?location=${encodeURIComponent(leadData.propertyAddress || '')}`, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Redfin
            </Button>
            <Button
              variant="link"
              className="p-0 h-auto text-crm-primary hover:text-crm-accent justify-start"
              onClick={() => window.open(`https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(leadData.propertyAddress || '')}`, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Realtor.com
            </Button>
            <Button
              variant="link"
              className="p-0 h-auto text-crm-primary hover:text-crm-accent justify-start"
              onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(leadData.propertyAddress || '')}`, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Google Maps
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
