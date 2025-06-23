
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  score: number;
  notes: string;
  avatar?: string;
  tags: string[];
}

interface LeadHeaderProps {
  lead: Lead;
}

export function LeadHeader({ lead }: LeadHeaderProps) {
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'HOT':
        return 'bg-red-500 text-white border-red-500 hover:bg-red-600';
      case 'WARM':
        return 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600';
      case 'COLD':
        return 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600';
      case 'PASS':
        return 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusIcon = (status: Lead['status']) => {
    switch (status) {
      case 'HOT':
        return '🔥';
      case 'WARM':
        return '🟡';
      case 'COLD':
        return '❄️';
      case 'PASS':
        return '⏭️';
    }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-white to-gray-50">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
            <AvatarImage src={lead.avatar} alt={lead.name} />
            <AvatarFallback className="bg-crm-primary text-white text-lg font-semibold">
              {lead.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-900">{lead.name}</CardTitle>
                <p className="text-lg text-gray-600 font-medium">{lead.position}</p>
                <p className="text-gray-500 flex items-center gap-1 mt-1">
                  <Building className="w-4 h-4" />
                  {lead.company}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-crm-primary mb-1">{lead.score}</div>
                <div className="text-sm text-gray-500">Lead Score</div>
                <Badge className={`${getStatusColor(lead.status)} mt-2 font-semibold text-sm px-3 py-1`}>
                  {getStatusIcon(lead.status)} {lead.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
