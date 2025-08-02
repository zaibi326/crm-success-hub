
import React from 'react';
import { PropertyMap } from '../PropertyMap';

interface PropertyMapSectionProps {
  address: string;
}

export function PropertyMapSection({ address }: PropertyMapSectionProps) {
  return (
    <div className="h-64">
      <PropertyMap address={address} />
    </div>
  );
}
