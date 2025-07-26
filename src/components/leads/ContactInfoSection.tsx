
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { User, Mail, Phone, MapPin, Building, ChevronDown } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  score: number;
  notes: string;
  avatar?: string;
  tags: string[];
}

interface ContactInfoSectionProps {
  formData: Lead;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  onInputChange: (field: keyof Lead, value: any) => void;
}

export function ContactInfoSection({ formData, isOpen, onToggle, onInputChange }: ContactInfoSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-crm-primary" />
                Contact Information
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => onInputChange('name', e.target.value)}
                  className="focus:ring-2 focus:ring-crm-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => onInputChange('email', e.target.value)}
                  className="focus:ring-2 focus:ring-crm-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => onInputChange('phone', e.target.value)}
                  className="focus:ring-2 focus:ring-crm-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Position
                </Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => onInputChange('position', e.target.value)}
                  className="focus:ring-2 focus:ring-crm-primary"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Business Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => onInputChange('address', e.target.value)}
                className="focus:ring-2 focus:ring-crm-primary"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => onInputChange('city', e.target.value)}
                  className="focus:ring-2 focus:ring-crm-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => onInputChange('state', e.target.value)}
                  className="focus:ring-2 focus:ring-crm-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => onInputChange('zip', e.target.value)}
                  className="focus:ring-2 focus:ring-crm-primary"
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
