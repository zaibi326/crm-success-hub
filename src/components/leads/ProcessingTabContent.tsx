
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Upload, Eye } from 'lucide-react';
import { LeadProcessingWorkflow } from './LeadProcessingWorkflow';
import { TaxLead } from '@/types/taxLead';

interface ProcessingTabContentProps {
  processingQueue: TaxLead[];
  onLeadUpdate: (updatedLead: TaxLead) => void;
  onComplete: () => void;
  onSetActiveTab: (tab: string) => void;
}

export function ProcessingTabContent({ 
  processingQueue, 
  onLeadUpdate, 
  onComplete, 
  onSetActiveTab 
}: ProcessingTabContentProps) {
  if (processingQueue.length > 0) {
    return (
      <LeadProcessingWorkflow
        leads={processingQueue}
        onLeadUpdate={onLeadUpdate}
        onComplete={onComplete}
      />
    );
  }

  return (
    <Card className="text-center py-12">
      <CardContent>
        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Leads in Processing Queue</h3>
        <p className="text-gray-600 mb-6">
          Upload a CSV file or select leads from the overview to start processing.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => onSetActiveTab('upload')} className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload CSV
          </Button>
          <Button variant="outline" onClick={() => onSetActiveTab('overview')} className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View All Leads
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
