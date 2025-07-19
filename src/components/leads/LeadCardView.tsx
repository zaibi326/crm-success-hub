
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, DollarSign, Calendar, User } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface LeadCardViewProps {
  leads: TaxLead[];
  onLeadSelect: (lead: TaxLead) => void;
  onLeadEdit?: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
}

export function LeadCardView({ leads, onLeadSelect, onLeadEdit, getStatusBadge }: LeadCardViewProps) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
          <p className="text-sm">Try adjusting your search criteria or filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {leads.map((lead) => (
          <Card 
            key={lead.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300 group h-full flex flex-col"
            onClick={() => onLeadSelect(lead)}
          >
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold text-gray-900 truncate" title={lead.ownerName}>
                    {lead.ownerName}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Tax ID: {lead.taxId}</p>
                </div>
                <Badge 
                  className={`${getStatusBadge(lead.status)} text-xs font-medium px-2 py-1 flex-shrink-0`}
                >
                  {lead.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 flex-1 flex flex-col">
              {/* Property Address */}
              <div className="flex items-start gap-2 min-h-0">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-sm text-gray-700 break-words leading-tight" 
                    title={lead.propertyAddress}
                    style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      wordBreak: 'break-word'
                    }}
                  >
                    {lead.propertyAddress}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                {lead.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate" title={lead.email}>
                      {lead.email}
                    </span>
                  </div>
                )}
                
                {lead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      {lead.phone}
                    </span>
                  </div>
                )}
              </div>

              {/* Financial Information */}
              {lead.currentArrears && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-red-600">
                    Arrears: ${lead.currentArrears.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Created Date */}
              {lead.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs text-gray-500">
                    Created: {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 mt-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLeadSelect(lead);
                  }}
                  className="flex-1 text-xs group-hover:border-blue-400 group-hover:text-blue-600"
                >
                  View Details
                </Button>
                {onLeadEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLeadEdit(lead);
                    }}
                    className="px-3 text-xs text-gray-600 hover:text-blue-600"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Summary */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Showing {leads.length} lead{leads.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
