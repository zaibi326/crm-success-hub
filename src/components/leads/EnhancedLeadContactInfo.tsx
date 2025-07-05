
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Mail, MapPin, User, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CommunicationPanel } from '@/components/communication/CommunicationPanel';

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

interface EnhancedLeadContactInfoProps {
  lead: Lead;
}

export function EnhancedLeadContactInfo({ lead }: EnhancedLeadContactInfoProps) {
  const { toast } = useToast();

  const handleQuickCall = () => {
    window.open(`tel:${lead.phone}`, '_self');
    toast({
      title: "Initiating Call via SmrtPhone.io",
      description: `Calling ${lead.name}...`,
    });
  };

  const handleQuickSMS = () => {
    toast({
      title: "Opening SMS Center",
      description: `Preparing message to ${lead.name}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Contact Actions */}
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

          {/* Enhanced Contact Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <Button 
              onClick={handleQuickCall}
              className="bg-green-600 hover:bg-green-700 text-white h-12"
            >
              <Phone className="w-5 h-5 mr-2" />
              SmrtPhone Call
            </Button>
            <Button 
              onClick={handleQuickSMS}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 h-12"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Send SMS
            </Button>
            <Button 
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 h-12"
            >
              <History className="w-5 h-5 mr-2" />
              Call History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integrated Communication Panel */}
      <CommunicationPanel 
        leadId={lead.id.toString()}
        phoneNumber={lead.phone}
        leadName={lead.name}
      />
    </div>
  );
}
