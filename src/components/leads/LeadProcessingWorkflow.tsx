
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText,
  Users,
  ChevronRight
} from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface LeadProcessingWorkflowProps {
  leads: TaxLead[];
  onLeadUpdate: (updatedLead: TaxLead) => void;
  onLeadProcessed?: (lead: TaxLead) => void;
  onComplete?: () => void;
}

export function LeadProcessingWorkflow({ 
  leads, 
  onLeadUpdate, 
  onLeadProcessed,
  onComplete 
}: LeadProcessingWorkflowProps) {
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);
  const [processedLeads, setProcessedLeads] = useState<Set<number>>(new Set());

  const currentLead = leads[currentLeadIndex];
  const progress = (processedLeads.size / leads.length) * 100;

  const handleLeadDecision = (decision: 'keep' | 'pass', reason?: string) => {
    if (!currentLead) return;
    
    const updatedLead: TaxLead = {
      ...currentLead,
      status: decision === 'keep' ? 'KEEP' : 'PASS',
      disposition: decision === 'keep' ? 'QUALIFIED' : 'DISQUALIFIED',
      notes: reason ? `${currentLead.notes || ''}\n\nDecision: ${reason}` : currentLead.notes
    };
    
    onLeadUpdate(updatedLead);
    if (onLeadProcessed) {
      onLeadProcessed(updatedLead);
    }
    
    setProcessedLeads(prev => new Set(prev).add(currentLead.id));
    
    if (currentLeadIndex < leads.length - 1) {
      setCurrentLeadIndex(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HOT':
        return <Badge className="bg-red-100 text-red-800">🔥 Hot</Badge>;
      case 'WARM':
        return <Badge className="bg-yellow-100 text-yellow-800">☀️ Warm</Badge>;
      case 'COLD':
        return <Badge className="bg-blue-100 text-blue-800">❄️ Cold</Badge>;
      case 'KEEP':
        return <Badge className="bg-green-100 text-green-800">✅ Keep</Badge>;
      case 'PASS':
        return <Badge className="bg-gray-100 text-gray-800">❌ Pass</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!currentLead) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Complete!</h3>
          <p className="text-gray-600">All leads have been processed successfully.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Lead Processing Workflow
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Processing lead {currentLeadIndex + 1} of {leads.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(progress)}%
              </div>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Current Lead Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{currentLead.ownerName}</CardTitle>
              <p className="text-gray-600">{currentLead.propertyAddress}</p>
            </div>
            {getStatusBadge(currentLead.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Tax ID</p>
              <p className="text-sm text-gray-900">{currentLead.taxId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Arrears</p>
              <p className="text-sm text-gray-900">
                {currentLead.currentArrears ? `$${currentLead.currentArrears.toLocaleString()}` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Phone</p>
              <p className="text-sm text-gray-900">{currentLead.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-sm text-gray-900">{currentLead.email || 'N/A'}</p>
            </div>
          </div>

          {currentLead.notes && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-800">{currentLead.notes}</p>
              </div>
            </div>
          )}

          {/* Decision Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              onClick={() => handleLeadDecision('keep')}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Keep Lead
            </Button>
            <Button
              onClick={() => handleLeadDecision('pass', 'Not qualified during review')}
              variant="outline"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Pass on Lead
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{leads.length}</div>
            <p className="text-sm text-gray-600">Total Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Array.from(processedLeads).filter(id => {
                const lead = leads.find(l => l.id === id);
                return lead?.status === 'KEEP';
              }).length}
            </div>
            <p className="text-sm text-gray-600">Kept</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {Array.from(processedLeads).filter(id => {
                const lead = leads.find(l => l.id === id);
                return lead?.status === 'PASS';
              }).length}
            </div>
            <p className="text-sm text-gray-600">Passed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
