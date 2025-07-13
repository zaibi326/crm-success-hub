
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Home } from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface ImportedDataSectionProps {
  lead: TaxLead;
}

export function ImportedDataSection({ lead }: ImportedDataSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <Home className="w-6 h-6 text-crm-primary" />
          Imported Lead Data
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Tax ID</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
              <span className="font-mono text-gray-900">{lead.taxId}</span>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Owner Name</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
              <span className="text-gray-900">{lead.ownerName}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Lawsuit Number</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
              <span className="font-mono text-gray-900">{lead.taxLawsuitNumber || 'N/A'}</span>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Property Address</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
              <span className="text-gray-900">{lead.propertyAddress}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
