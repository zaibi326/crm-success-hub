
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, ExternalLink, Eye, Edit, MessageSquare } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface LeadCardViewProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  onLeadEdit: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
}

export function LeadCardView({ leads, onLeadSelect, onLeadEdit, getStatusBadge }: LeadCardViewProps) {
  const handleCall = (phoneNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleEmail = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`mailto:${email}`, '_self');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {leads.map((lead) => (
        <Card 
          key={lead.id} 
          className="hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => onLeadSelect(lead)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-crm-primary transition-colors">
                  {lead.ownerName}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{lead.propertyAddress}</span>
                </div>
              </div>
              <Badge className={getStatusBadge(lead.status)}>
                {lead.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {/* Contact Information */}
            <div className="space-y-2">
              {lead.phone && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{lead.phone}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleCall(lead.phone!, e)}
                    className="h-8 w-8 p-0"
                  >
                    <Phone className="w-3 h-3" />
                  </Button>
                </div>
              )}
              
              {lead.email && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleEmail(lead.email!, e)}
                    className="h-8 w-8 p-0"
                  >
                    <Mail className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Financial Info */}
            {lead.currentArrears && (
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm font-medium text-green-800">Current Arrears</span>
                <span className="font-bold text-green-600">
                  ${lead.currentArrears.toLocaleString()}
                </span>
              </div>
            )}

            {/* Tax ID */}
            {lead.taxId && (
              <div className="text-xs text-gray-500">
                Tax ID: {lead.taxId}
              </div>
            )}

            {/* Notes Preview */}
            {lead.notes && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <div className="flex items-center gap-1 mb-1">
                  <MessageSquare className="w-3 h-3" />
                  <span className="font-medium">Notes</span>
                </div>
                <p className="line-clamp-2 text-xs">
                  {lead.notes.length > 100 ? `${lead.notes.substring(0, 100)}...` : lead.notes}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onLeadSelect(lead);
                }}
                className="flex-1"
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onLeadEdit(lead);
                }}
                className="flex-1"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
