
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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

interface LeadDetailsProps {
  lead: Lead;
}

export function LeadDetails({ lead }: LeadDetailsProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              🏷️ Lead Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {lead.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 font-medium"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              📝 Lead Notes
            </h4>
            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-crm-primary">
              <p className="text-gray-700 leading-relaxed">{lead.notes}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
