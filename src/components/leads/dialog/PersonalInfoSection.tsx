
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalInfoSectionProps {
  firstName: string;
  lastName: string;
  onInputChange: (field: string, value: string) => void;
}

export function PersonalInfoSection({ firstName, lastName, onInputChange }: PersonalInfoSectionProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="firstName" className="w-24 text-right font-medium">
            First Name *
          </Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            placeholder="Enter first name"
            className="flex-1"
            required
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Label htmlFor="lastName" className="w-24 text-right font-medium">
            Last Name
          </Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            placeholder="Enter last name"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
