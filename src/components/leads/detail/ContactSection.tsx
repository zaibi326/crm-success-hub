
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageSquare, User } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface ContactSectionProps {
  lead: TaxLead;
  onCall: (phoneNumber: string) => void;
  onSendText: (phoneNumber: string) => void;
  onEmail: (email: string) => void;
}

export function ContactSection({ lead, onCall, onSendText, onEmail }: ContactSectionProps) {
  return (
    <div className="podio-container p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-podio-primary" />
        <h3 className="font-semibold text-podio-text">Seller Contact</h3>
      </div>
      <div className="space-y-4">
        <div className="podio-field-row">
          <div className="podio-field-label">Seller Name</div>
          <div className="podio-field-value font-medium">{lead.ownerName}</div>
        </div>
        
        {lead.phone && (
          <div className="podio-field-row">
            <div className="podio-field-label">Seller Phone</div>
            <div className="podio-field-value flex items-center gap-2">
              <span>{lead.phone}</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  onClick={() => onCall(lead.phone!)}
                  className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Phone className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => onSendText(lead.phone!)}
                  className="h-7 px-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageSquare className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {lead.email && (
          <div className="podio-field-row">
            <div className="podio-field-label">Seller Email</div>
            <div className="podio-field-value flex items-center gap-2">
              <span>{lead.email}</span>
              <Button
                size="sm"
                onClick={() => onEmail(lead.email!)}
                className="h-7 px-2 bg-podio-primary hover:bg-blue-600 text-white"
              >
                <Mail className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
