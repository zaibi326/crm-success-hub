
import React from 'react';
import { ZillowMap } from '../ZillowMap';

interface PropertyMapSectionProps {
  address: string;
}

export function PropertyMapSection({ address }: PropertyMapSectionProps) {
  return (
    <div className="w-full">
      <ZillowMap address={address} className="h-80 w-full" />
    </div>
  );
}
