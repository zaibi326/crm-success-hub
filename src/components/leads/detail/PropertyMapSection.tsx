
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Home } from 'lucide-react';
import { ZillowMap } from '../ZillowMap';

interface PropertyMapSectionProps {
  address: string;
}

export function PropertyMapSection({ address }: PropertyMapSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <div>
              <div className="text-lg font-semibold text-blue-900">Property Location & Analysis</div>
              <div className="text-sm text-blue-700 font-normal">Interactive Zillow Integration</div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ZillowMap address={address} />
      </CardContent>
    </Card>
  );
}
