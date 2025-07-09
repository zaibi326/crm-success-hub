
import React from 'react';
import { MapPin } from 'lucide-react';

interface PropertyMapProps {
  address: string;
}

export function PropertyMap({ address }: PropertyMapProps) {
  const encodedAddress = encodeURIComponent(address);
  
  // For now, we'll show a placeholder. In production, you would use Google Maps API
  return (
    <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
          <MapPin className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-blue-800 text-sm font-medium mb-1">{address}</p>
        <p className="text-blue-600 text-xs">Interactive map will appear here</p>
        <div className="mt-3 flex gap-2 justify-center">
          <button
            onClick={() => window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank')}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          >
            Open in Google Maps
          </button>
          <button
            onClick={() => window.open(`https://www.zillow.com/homes/${encodedAddress}`, '_blank')}
            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
          >
            View on Zillow
          </button>
        </div>
      </div>
    </div>
  );
}
