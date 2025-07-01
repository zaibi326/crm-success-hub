
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Phone, Mail, DollarSign, FileText, Edit } from 'lucide-react';

interface Lead {
  id: number;
  taxId: string;
  ownerName: string;
  propertyAddress: string;
  taxLawsuitNumber?: string;
  currentArrears?: number;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  notes?: string;
  phone?: string;
  email?: string;
}

interface LeadReviewCardProps {
  lead: Lead;
  onLeadUpdate: (updatedLead: Lead) => void;
  onOpenDetailedForm?: () => void;
}

const statusColors = {
  HOT: 'bg-red-100 text-red-800 border-red-200',
  WARM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  COLD: 'bg-blue-100 text-blue-800 border-blue-200',
  PASS: 'bg-gray-100 text-gray-800 border-gray-200'
};

export function LeadReviewCard({ lead, onLeadUpdate, onOpenDetailedForm }: LeadReviewCardProps) {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {lead.ownerName}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={statusColors[lead.status]}>
              {lead.status}
            </Badge>
            {onOpenDetailedForm && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenDetailedForm}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Details
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Property Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-crm-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-700">Property Address</p>
                <p className="text-gray-600 text-sm">{lead.propertyAddress}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-crm-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-700">Tax ID</p>
                <p className="text-gray-600 text-sm font-mono">{lead.taxId}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {lead.currentArrears && (
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-700">Current Arrears</p>
                  <p className="text-green-600 font-bold">
                    ${lead.currentArrears.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            
            {lead.taxLawsuitNumber && (
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-crm-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-700">Lawsuit Number</p>
                  <p className="text-gray-600 text-sm font-mono">{lead.taxLawsuitNumber}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        {(lead.phone || lead.email) && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-crm-primary flex-shrink-0" />
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-crm-primary hover:text-crm-accent transition-colors"
                  >
                    {lead.phone}
                  </a>
                </div>
              )}
              
              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-crm-primary flex-shrink-0" />
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-crm-primary hover:text-crm-accent transition-colors"
                  >
                    {lead.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {lead.notes && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Notes</h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-gray-700 text-sm leading-relaxed">{lead.notes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
