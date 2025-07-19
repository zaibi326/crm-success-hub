
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, RefreshCw } from 'lucide-react';

interface ZillowMapProps {
  address: string;
  className?: string;
}

export function ZillowMap({ address, className = '' }: ZillowMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  const encodedAddress = encodeURIComponent(address);
  
  // Create Zillow map embed URL
  const zillowMapUrl = `https://www.zillow.com/homes/${encodedAddress}/?searchQueryState=%7B%22mapBounds%22%3A%7B%22west%22%3A-122.5%2C%22east%22%3A-122.3%2C%22south%22%3A37.7%2C%22north%22%3A37.8%7D%2C%22isMapVisible%22%3Atrue%2C%22filterState%22%3A%7B%7D%2C%22isListVisible%22%3Afalse%7D`;
  
  // Alternative: Google Maps embed (more reliable)
  const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO9jJ5aKmYYT9U&q=${encodedAddress}`;

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setMapKey(prev => prev + 1);
  };

  const openZillow = () => {
    window.open(`https://www.zillow.com/homes/${encodedAddress}/`, '_blank');
  };

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank');
  };

  return (
    <Card className={`shadow-lg border-0 bg-white/80 backdrop-blur-sm ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            Property Map & Location
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Address Display */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <p className="text-gray-900 font-medium">{address}</p>
        </div>

        {/* Interactive Map Container */}
        <div className="relative w-full h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-blue-600 text-sm">Loading map...</p>
              </div>
            </div>
          )}

          {hasError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-red-800 text-sm font-medium mb-1">Map not available</p>
                <p className="text-red-600 text-xs mb-3">Unable to load interactive map</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <iframe
              key={mapKey}
              src={googleMapsUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              className="rounded-lg"
            />
          )}
        </div>

        {/* External Links */}
        <div className="flex flex-wrap gap-2 mt-6">
          <Button
            onClick={openZillow}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on Zillow
          </Button>
          <Button
            onClick={openGoogleMaps}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Google Maps
          </Button>
          <Button
            onClick={() => window.open(`https://www.realtor.com/realestateandhomes-search/${encodedAddress}`, '_blank')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Realtor.com
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
