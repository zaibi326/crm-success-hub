
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageSquare, MapPin, User } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface EnhancedLeadContactInfoProps {
  lead: TaxLead;
}

export function EnhancedLeadContactInfo({ lead }: EnhancedLeadContactInfoProps) {
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleText = (phoneNumber: string) => {
    window.location.href = `sms:${phoneNumber}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <div>
              <div className="font-medium">Property Address</div>
              <div className="text-sm text-gray-600">{lead.propertyAddress}</div>
            </div>
          </div>

          {lead.sellerContactAddress && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <div>
                <div className="font-medium">Seller Contact Address</div>
                <div className="text-sm text-gray-600">{lead.sellerContactAddress}</div>
              </div>
            </div>
          )}

          {lead.phone && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-sm text-gray-600">{lead.phone}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCall(lead.phone!)}
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleText(lead.phone!)}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {lead.email && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-gray-600">{lead.email}</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEmail(lead.email!)}
              >
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {lead.taxId && (
          <div className="pt-3 border-t">
            <div className="font-medium">Tax ID</div>
            <div className="text-sm text-gray-600 font-mono">{lead.taxId}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
