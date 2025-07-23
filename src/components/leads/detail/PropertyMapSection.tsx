
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { ZillowMap } from '../ZillowMap';

interface PropertyMapSectionProps {
  address: string;
}

export function PropertyMapSection({ address }: PropertyMapSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-crm-primary" />
          Property Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ZillowMap address={address} />
      </CardContent>
    </Card>
  );
}
