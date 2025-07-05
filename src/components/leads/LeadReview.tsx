
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building, Phone, Mail, MapPin } from 'lucide-react';

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

interface LeadReviewProps {
  lead: Lead;
  onStatusChange: (status: 'HOT' | 'WARM' | 'COLD' | 'PASS') => void;
}

export function LeadReview({ lead, onStatusChange }: LeadReviewProps) {
  return (
    <div className="space-y-6">
      {/* Lead Header Section */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-white to-gray-50">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
              <AvatarImage src={lead.avatar} alt={lead.name} />
              <AvatarFallback className="bg-crm-primary text-white text-lg font-semibold">
                {lead.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl text-gray-900">{lead.name}</CardTitle>
                  <p className="text-lg text-gray-600 font-medium">{lead.position}</p>
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
                    <Building className="w-4 h-4" />
                    {lead.company}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-crm-primary mb-1">{lead.score}</div>
                  <div className="text-sm text-gray-500">Lead Score</div>
                  <Badge className={`mt-2 font-semibold text-sm px-3 py-1`}>
                    {lead.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contact Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-crm-primary" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{lead.email}</div>
                <div className="text-sm text-gray-500">Email Address</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-crm-primary" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{lead.phone}</div>
                <div className="text-sm text-gray-500">Phone Number</div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <MapPin className="w-5 h-5 text-crm-primary mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {lead.address}, {lead.city}, {lead.state} {lead.zip}
              </div>
              <div className="text-sm text-gray-500">Business Address</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={() => onStatusChange('PASS')}
          variant="outline"
          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
        >
          Pass
        </Button>
        <Button 
          onClick={() => onStatusChange('HOT')}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          Keep & Review
        </Button>
      </div>
    </div>
  );
}
