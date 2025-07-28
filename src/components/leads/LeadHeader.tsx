
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface LeadHeaderProps {
  lead: TaxLead;
  onBack: () => void;
}

export function LeadHeader({ lead, onBack }: LeadHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HOT': return 'bg-red-100 text-red-800';
      case 'WARM': return 'bg-orange-100 text-orange-800';
      case 'COLD': return 'bg-blue-100 text-blue-800';
      case 'PASS': return 'bg-gray-100 text-gray-800';
      case 'KEEP': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leads
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{lead.ownerName}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {lead.propertyAddress}
            </div>
            {lead.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {lead.phone}
              </div>
            )}
            {lead.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {lead.email}
              </div>
            )}
          </div>
        </div>
      </div>
      <Badge className={getStatusColor(lead.status)}>
        {lead.status}
      </Badge>
    </div>
  );
}
