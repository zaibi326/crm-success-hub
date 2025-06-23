
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Mail, MapPin, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface LeadContactInfoProps {
  lead: Lead;
}

export function LeadContactInfo({ lead }: LeadContactInfoProps) {
  const { toast } = useToast();

  const handleCall = () => {
    window.open(`tel:${lead.phone}`, '_self');
    toast({
      title: "Calling...",
      description: `Initiating call to ${lead.name}`,
    });
  };

  const handleSMS = () => {
    window.open(`sms:${lead.phone}`, '_self');
    toast({
      title: "Opening SMS",
      description: `Preparing message to ${lead.name}`,
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="w-5 h-5 text-crm-primary" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <Mail className="w-5 h-5 text-crm-primary" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{lead.email}</div>
              <div className="text-sm text-gray-500">Email Address</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <Phone className="w-5 h-5 text-crm-primary" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{lead.phone}</div>
              <div className="text-sm text-gray-500">Phone Number</div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
          <MapPin className="w-5 h-5 text-crm-primary mt-0.5" />
          <div className="flex-1">
            <div className="font-medium text-gray-900">
              {lead.address}, {lead.city}, {lead.state} {lead.zip}
            </div>
            <div className="text-sm text-gray-500">Business Address</div>
          </div>
        </div>

        {/* Contact Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={handleCall}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Now
          </Button>
          <Button 
            onClick={handleSMS}
            variant="outline"
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50 h-12"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Send SMS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
