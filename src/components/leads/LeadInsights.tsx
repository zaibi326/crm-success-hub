
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Calendar, User } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface LeadInsightsProps {
  lead: TaxLead;
}

export function LeadInsights({ lead }: LeadInsightsProps) {
  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case 'HOT': return 'text-red-600 bg-red-50';
      case 'WARM': return 'text-orange-600 bg-orange-50';
      case 'COLD': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getOccupancyColor = (occupancy: string) => {
    switch (occupancy) {
      case 'OWNER_OCCUPIED': return 'text-green-600 bg-green-50';
      case 'TENANT_OCCUPIED': return 'text-blue-600 bg-blue-50';
      case 'VACANT': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Lead Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Temperature</div>
            <Badge className={getTemperatureColor(lead.temperature)}>
              {lead.temperature}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Occupancy</div>
            <Badge className={getOccupancyColor(lead.occupancyStatus)}>
              {lead.occupancyStatus?.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            Current Arrears
          </div>
          <div className="text-lg font-semibold">
            ${lead.currentArrears?.toLocaleString() || '0'}
          </div>
        </div>

        {lead.taxLawsuitNumber && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Tax Lawsuit #</div>
            <div className="font-mono text-sm">{lead.taxLawsuitNumber}</div>
          </div>
        )}

        {lead.createdAt && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Created
            </div>
            <div className="text-sm">
              {new Date(lead.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}

        {lead.agentName && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <User className="w-4 h-4" />
              Agent
            </div>
            <div className="text-sm">{lead.agentName}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
