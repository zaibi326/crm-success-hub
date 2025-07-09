
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Tag, Calendar } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface LeadListItemProps {
  lead: TaxLead;
  onLeadSelect: (lead: TaxLead) => void;
  getStatusBadge: (status: string) => string;
}

export function LeadListItem({ lead, onLeadSelect, getStatusBadge }: LeadListItemProps) {
  return (
    <Card 
      key={lead.id} 
      className="hover:shadow-md transition-shadow cursor-pointer border"
      onClick={() => onLeadSelect(lead)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              className="rounded border-gray-300"
              onClick={(e) => e.stopPropagation()}
            />
            <h3 className="font-semibold text-blue-600 hover:text-blue-800">{lead.ownerName}</h3>
          </div>
          <Badge className={`${getStatusBadge(lead.status)} border text-xs`}>
            {lead.status}
          </Badge>
        </div>
        <div className="space-y-1 text-sm text-gray-600 ml-7">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{lead.propertyAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              Streamlinerz
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          {lead.currentArrears && (
            <div className="text-green-600 font-medium">
              ${lead.currentArrears.toLocaleString()} in arrears
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
