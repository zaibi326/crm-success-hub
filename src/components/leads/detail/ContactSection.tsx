
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MessageSquare, User } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface ContactSectionProps {
  lead: TaxLead;
  onCall: (phoneNumber: string) => void;
  onSendText: (phoneNumber: string) => void;
  onEmail: (email: string) => void;
  onLeadUpdate: (updatedLead: TaxLead) => void;
}

export function ContactSection({ 
  lead, 
  onCall, 
  onSendText, 
  onEmail, 
  onLeadUpdate 
}: ContactSectionProps) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLeadUpdate({ ...lead, phone: e.target.value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLeadUpdate({ ...lead, email: e.target.value });
  };

  const handleOwnerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLeadUpdate({ ...lead, ownerName: e.target.value });
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-crm-primary" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            value={lead.ownerName || ''}
            onChange={handleOwnerNameChange}
            placeholder="Enter owner name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex gap-2">
            <Input
              id="phone"
              value={lead.phone || ''}
              onChange={handlePhoneChange}
              placeholder="Enter phone number"
              className="flex-1"
            />
            {lead.phone && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCall(lead.phone!)}
                  className="px-3"
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSendText(lead.phone!)}
                  className="px-3"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              value={lead.email || ''}
              onChange={handleEmailChange}
              placeholder="Enter email address"
              className="flex-1"
            />
            {lead.email && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEmail(lead.email!)}
                className="px-3"
              >
                <Mail className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
