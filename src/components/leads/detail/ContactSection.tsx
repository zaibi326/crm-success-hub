
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { CommunicationButton } from '@/components/communication/CommunicationButton';

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
                <CommunicationButton
                  phoneNumber={lead.phone}
                  leadId={lead.id.toString()}
                  leadName={lead.ownerName}
                  type="call"
                  onCommunicationStart={onCall}
                />
                <CommunicationButton
                  phoneNumber={lead.phone}
                  leadId={lead.id.toString()}
                  leadName={lead.ownerName}
                  type="sms"
                  onCommunicationStart={onSendText}
                />
              </div>
            </div>
          </div>
        )}
        
        {lead.email && (
          <div className="podio-field-row">
            <div className="podio-field-label">Seller Email</div>
            <div className="podio-field-value flex items-center gap-2">
              <span>{lead.email}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
