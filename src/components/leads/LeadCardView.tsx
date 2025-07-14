
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink, Eye, Edit, MessageSquare, Sparkles } from 'lucide-react';
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

  const getStatusCardClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'HOT':
        return 'status-card-hot';
      case 'WARM':
        return 'status-card-warm';
      case 'COLD':
        return 'status-card-cold';
      case 'PASS':
        return 'status-card-pass';
      default:
        return 'status-card-cold';
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status.toUpperCase()) {
      case 'HOT':
        return 'from-red-500 to-pink-500';
      case 'WARM':
        return 'from-amber-500 to-orange-500';
      case 'COLD':
        return 'from-blue-500 to-cyan-500';
      case 'PASS':
        return 'from-gray-500 to-slate-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {leads.map((lead, index) => (
        <Card 
          key={lead.id} 
          className={`bright-card ${getStatusCardClass(lead.status)} cursor-pointer group animate-bounce-in hover:scale-105 transition-all duration-300`}
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => onLeadSelect(lead)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getStatusGradient(lead.status)} shadow-lg animate-pulse-slow`}></div>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-bright-blue transition-colors duration-300">
                    {lead.ownerName}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                  <MapPin className="w-4 h-4 text-bright-teal" />
                  <span className="truncate">{lead.propertyAddress}</span>
                </div>
              </div>
              <Badge className={`${getStatusBadge(lead.status)} shadow-md hover:scale-110 transition-transform duration-300`}>
                {lead.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Contact Information with Communication Buttons */}
            <div className="space-y-3">
              {lead.phone && (
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
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
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <span className="truncate">{lead.email}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleEmail(lead.email!, e)}
                    className="h-8 w-8 p-0 text-bright-blue hover:text-white hover:bg-gradient-to-r hover:from-bright-blue hover:to-bright-teal hover:scale-110 transition-all duration-300"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Financial Info */}
            {lead.currentArrears && (
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-bright-green to-bright-teal rounded-full"></div>
                  <span className="text-sm font-semibold text-green-800">Current Arrears</span>
                </div>
                <span className="font-bold text-green-700 text-lg">
                  ${lead.currentArrears.toLocaleString()}
                </span>
              </div>
            )}

            {lead.taxId && (
              <div className="text-xs text-slate-500 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-bright-purple" />
                  <span className="font-medium">Tax ID: {lead.taxId}</span>
                </div>
              </div>
            )}

            {lead.notes && (
              <div className="text-sm bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-bright-blue" />
                  <span className="font-semibold text-blue-800">Notes</span>
                </div>
                <p className="line-clamp-2 text-xs text-blue-700">
                  {lead.notes.length > 100 ? `${lead.notes.substring(0, 100)}...` : lead.notes}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3 border-t border-white/30">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onLeadSelect(lead);
                }}
                className="flex-1 bright-button-primary ripple"
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
                className="flex-1 bright-button-secondary ripple"
              >
                <Edit className="w-3 h-3 mr-2" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
