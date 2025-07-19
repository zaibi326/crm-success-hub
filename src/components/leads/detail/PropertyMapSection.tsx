
import React from 'react';
import { ZillowMap } from '../ZillowMap';

interface PropertyMapSectionProps {
  address: string;
}

export function PropertyMapSection({ address }: PropertyMapSectionProps) {
  return <ZillowMap address={address} />;
}
