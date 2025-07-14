
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Eye, Edit, MessageSquare, Phone } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { CommunicationButton } from '@/components/communication/CommunicationButton';

interface LeadCardViewProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  onLeadEdit: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
}

export function LeadCardView({ leads, onLeadSelect, onLeadEdit, getStatusBadge }: LeadCardViewProps) {
  const handleCommunication = (type: 'call' | 'sms', phoneNumber: string) => {
    console.log(`${type === 'call' ? 'Calling' : 'SMS to'} ${phoneNumber}`);
  };

  const handleEmail = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`mailto:${email}`, '_self');
  };

  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case 'HOT':
        return {
          cardClass: 'status-card-hot',
          badgeClass: 'agile-tag agile-tag-red',
          dotColor: 'bg-agile-red'
        };
      case 'WARM':
        return {
          cardClass: 'status-card-warm',
          badgeClass: 'agile-tag agile-tag-coral',
          dotColor: 'bg-agile-coral'
        };
      case 'COLD':
        return {
          cardClass: 'status-card-cold',
          badgeClass: 'agile-tag agile-tag-blue',
          dotColor: 'bg-agile-blue'
        };
      case 'PASS':
        return {
          cardClass: 'status-card-pass',
          badgeClass: 'agile-tag agile-tag-gray',
          dotColor: 'bg-agile-gray-400'
        };
      default:
        return {
          cardClass: 'status-card-cold',
          badgeClass: 'agile-tag agile-tag-blue',
          dotColor: 'bg-agile-blue'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {leads.map((lead, index) => {
        const statusStyles = getStatusStyles(lead.status);
        
        return (
          <Card 
            key={lead.id} 
            className={`agile-card agile-card-hover cursor-pointer animate-bounce-in ${statusStyles.cardClass}`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => onLeadSelect(lead)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${statusStyles.dotColor}`}></div>
                    <h3 className="font-semibold text-lg text-agile-gray-800 hover:text-agile-blue transition-colors duration-200">
                      {lead.ownerName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-agile-gray-600 mt-2">
                    <MapPin className="w-4 h-4 text-agile-blue" />
                    <span className="truncate">{lead.propertyAddress}</span>
                  </div>
                </div>
                <Badge className={statusStyles.badgeClass}>
                  {lead.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-3">
                {lead.phone && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-agile-gray-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-agile-gray-700">
                      <Phone className="w-4 h-4 text-agile-blue" />
                      <span>{lead.phone}</span>
                    </div>
                    <div className="flex gap-2">
                      <CommunicationButton
                        phoneNumber={lead.phone}
                        leadId={lead.id.toString()}
                        leadName={lead.ownerName}
                        type="call"
                        onCommunicationStart={handleCommunication}
                      />
                      <CommunicationButton
                        phoneNumber={lead.phone}
                        leadId={lead.id.toString()}
                        leadName={lead.ownerName}
                        type="sms"
                        onCommunicationStart={handleCommunication}
                      />
                    </div>
                  </div>
                )}
                
                {lead.email && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-agile-gray-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-agile-gray-700">
                      <MessageSquare className="w-4 h-4 text-agile-blue" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleEmail(lead.email!, e)}
                      className="h-8 w-8 p-0 text-agile-blue hover:text-white hover:bg-agile-blue"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Financial Info */}
              {lead.currentArrears && (
                <div className="flex justify-between items-center p-4 bg-agile-green-50 rounded-lg border border-agile-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-agile-green rounded-full"></div>
                    <span className="text-sm font-semibold text-agile-green-700">Current Arrears</span>
                  </div>
                  <span className="font-bold text-agile-green-700 text-lg">
                    ${lead.currentArrears.toLocaleString()}
                  </span>
                </div>
              )}

              {lead.taxId && (
                <div className="text-xs text-agile-gray-500 p-2 bg-agile-gray-50 rounded-lg border border-agile-gray-200">
                  <span className="font-medium">Tax ID: {lead.taxId}</span>
                </div>
              )}

              {lead.notes && (
                <div className="text-sm bg-agile-blue-50 p-3 rounded-lg border border-agile-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-agile-blue" />
                    <span className="font-semibold text-agile-blue-700">Notes</span>
                  </div>
                  <p className="line-clamp-2 text-xs text-agile-blue-700">
                    {lead.notes.length > 100 ? `${lead.notes.substring(0, 100)}...` : lead.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-agile-gray-200">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLeadSelect(lead);
                  }}
                  className="flex-1 agile-button-primary ripple"
                >
                  <Eye className="w-3 h-3 mr-2" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLeadEdit(lead);
                  }}
                  className="flex-1 agile-button-secondary ripple"
                >
                  <Edit className="w-3 h-3 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
