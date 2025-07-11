
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactInfoSectionProps {
  phone: string;
  email: string;
  onInputChange: (field: string, value: string) => void;
}

export function ContactInfoSection({ phone, email, onInputChange }: ContactInfoSectionProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">Contact Information</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="phone" className="w-24 text-right font-medium">
            Phone *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
            className="flex-1"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Label htmlFor="email" className="w-24 text-right font-medium">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="seller@email.com"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
