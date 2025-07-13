
import React from 'react';
import { MapPin } from 'lucide-react';
import { PropertyMap } from '../PropertyMap';

interface PropertyMapSectionProps {
  address: string;
}

export function PropertyMapSection({ address }: PropertyMapSectionProps) {
  return (
    <div className="podio-container p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-podio-primary" />
        <h3 className="font-semibold text-podio-text">Property Location</h3>
      </div>
      <PropertyMap address={address} />
    </div>
  );
}
