
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, RefreshCw, Search, Home, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ZillowMapProps {
  address: string;
  className?: string;
}

interface PropertyData {
  price?: string;
  beds?: string;
  baths?: string;
  sqft?: string;
  propertyType?: string;
  yearBuilt?: string;
}

export function ZillowMap({ address, className = '' }: ZillowMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [propertyData, setPropertyData] = useState<PropertyData>({});
  const [showPropertyInfo, setShowPropertyInfo] = useState(false);
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const encodedAddress = encodeURIComponent(address);
  
  // Enhanced Google Maps embed with better styling and features
  const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO9jJ5aKmYYT9U&q=${encodedAddress}&zoom=16&maptype=hybrid`;

  // Simulate property data fetching (in real implementation, this would use Zillow API)
  useEffect(() => {
    const fetchPropertyData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock property data (in real implementation, fetch from Zillow API)
        setPropertyData({
          price: '$245,000',
          beds: '3',
          baths: '2',
          sqft: '1,450',
          propertyType: 'Single Family',
          yearBuilt: '1995'
        });
      } catch (error) {
        console.error('Error fetching property data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchPropertyData();
    }
  }, [address]);

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
    toast({
      title: "Map Refreshed",
      description: "Property map has been updated",
    });
  };

  const openZillowProperty = () => {
    window.open(`https://www.zillow.com/homes/${encodedAddress}/`, '_blank');
  };

  const openZillowComps = () => {
    window.open(`https://www.zillow.com/homes/comps/${encodedAddress}/`, '_blank');
  };

  const openZillowRentEstimate = () => {
    window.open(`https://www.zillow.com/rental-manager/price-my-rental/${encodedAddress}/`, '_blank');
  };

  const searchNearbyProperties = () => {
    window.open(`https://www.zillow.com/homes/for_sale/${encodedAddress}/`, '_blank');
  };

  return (
    <Card className={`shadow-lg border-0 bg-white/95 backdrop-blur-sm ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <div>
              <div className="text-lg font-semibold text-blue-900">Property Map & Analysis</div>
              <div className="text-sm text-blue-700 font-normal">Zillow Integration</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPropertyInfo(!showPropertyInfo)}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <Home className="w-4 h-4 mr-1" />
              {showPropertyInfo ? 'Hide Info' : 'Property Info'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Address Display */}
        <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Property Address</span>
          </div>
          <p className="text-gray-900 font-medium">{address}</p>
        </div>

        {/* Property Information Panel */}
        {showPropertyInfo && (
          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-900">Property Details</span>
            </div>
            
            {isLoading ? (
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading property data...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-green-700 font-medium">Price:</span>
                  <div className="text-green-900">{propertyData.price || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Beds/Baths:</span>
                  <div className="text-green-900">{propertyData.beds || 'N/A'} / {propertyData.baths || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Square Feet:</span>
                  <div className="text-green-900">{propertyData.sqft || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Type:</span>
                  <div className="text-green-900">{propertyData.propertyType || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Year Built:</span>
                  <div className="text-green-900">{propertyData.yearBuilt || 'N/A'}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interactive Map Container */}
        <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-200 overflow-hidden shadow-inner">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
              <div className="text-center">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-blue-600 font-medium">Loading interactive map...</p>
                <p className="text-blue-500 text-sm mt-1">Geocoding property address</p>
              </div>
            </div>
          )}

          {hasError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 border-2 border-red-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-red-800 font-medium mb-1">Map Loading Error</p>
                <p className="text-red-600 text-sm mb-4">Unable to load map for this address</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
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
              title={`Map for ${address}`}
            />
          )}
        </div>

        {/* Enhanced Zillow Action Buttons */}
        <div className="mt-6 space-y-4">
          <div className="text-sm font-medium text-gray-700">Zillow Property Tools</div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
        </div>

        {/* Additional Resources */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-3">Additional Resources</div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank')}
              variant="link"
              size="sm"
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Google Maps
            </Button>
            <Button
              onClick={() => window.open(`https://www.realtor.com/realestateandhomes-search/${encodedAddress}`, '_blank')}
              variant="link"
              size="sm"
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Realtor.com
            </Button>
            <Button
              onClick={() => window.open(`https://www.redfin.com/stingray/do/location-search?location=${encodedAddress}`, '_blank')}
              variant="link"
              size="sm"
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Redfin
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
