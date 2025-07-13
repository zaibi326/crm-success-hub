
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink } from 'lucide-react';

interface PropertyMapSectionProps {
  address: string;
}

export function PropertyMapSection({ address }: PropertyMapSectionProps) {
  const encodedAddress = encodeURIComponent(address);
  
  const openZillow = () => {
    window.open(`https://www.zillow.com/homes/${encodedAddress}/`, '_blank');
  };

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank');
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <MapPin className="w-6 h-6 text-blue-600" />
          Property Location & Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Address Display */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <p className="text-gray-900 font-medium">{address}</p>
        </div>

        {/* Map Placeholder with Zillow Integration */}
        <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-blue-800 text-sm font-medium mb-1">Property Location</p>
            <p className="text-blue-600 text-xs mb-3">Interactive map integration coming soon</p>
          </div>
        </div>

        {/* External Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            onClick={openZillow}
            variant="outline"
            className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on Zillow
          </Button>
          
          <Button
            onClick={openGoogleMaps}
            variant="outline"
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Google Maps
          </Button>
          
          <Button
            onClick={() => window.open(`https://www.realtor.com/realestateandhomes-search/${encodedAddress}`, '_blank')}
            variant="outline"
            className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Realtor.com
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
