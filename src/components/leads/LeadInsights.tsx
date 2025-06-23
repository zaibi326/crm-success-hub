
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface LeadInsightsProps {
  lead: Lead;
}

export function LeadInsights({ lead }: LeadInsightsProps) {
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

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          📊 Lead Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">Engagement Score</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-crm-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${lead.score}%` }}
                />
              </div>
              <span className="font-bold text-crm-primary">{lead.score}/100</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">Priority Level</span>
            <Badge className={`${getStatusColor(lead.status)} text-sm font-semibold`}>
              {lead.status}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">Company Type</span>
            <span className="font-semibold text-gray-900">
              {lead.score > 80 ? 'Enterprise' : lead.score > 60 ? 'Mid-Market' : 'SMB'}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">Tags Count</span>
            <span className="font-semibold text-gray-900">{lead.tags.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
