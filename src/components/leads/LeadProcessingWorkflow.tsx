
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react';
import { TaxLead } from '@/types/taxLead';

interface LeadProcessingWorkflowProps {
  leads: TaxLead[];
  onLeadUpdate: (updatedLead: TaxLead) => void;
  onLeadProcessed: (leadId: number, action: 'keep' | 'pass') => void;
  onComplete?: () => void;
}

export function LeadProcessingWorkflow({ 
  leads, 
  onLeadUpdate, 
  onLeadProcessed,
  onComplete 
}: LeadProcessingWorkflowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  
  // Filter leads to only show unprocessed ones
  const unprocessedLeads = leads.filter(lead => 
    lead.disposition === 'UNDECIDED' || !lead.disposition
  );
  
  const currentLead = unprocessedLeads[currentIndex];
  
  const handleAction = (action: 'keep' | 'pass') => {
    if (!currentLead) return;
    
    const updatedLead: TaxLead = {
      ...currentLead,
      disposition: action === 'keep' ? 'QUALIFIED' : 'DISQUALIFIED',
      status: action === 'keep' ? 'KEEP' : 'PASS'
    };
    
    onLeadUpdate(updatedLead);
    onLeadProcessed(currentLead.id, action);
    
    setProcessedCount(prev => prev + 1);
    
    // Move to next lead
    if (currentIndex < unprocessedLeads.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const goToNext = () => {
    if (currentIndex < unprocessedLeads.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (unprocessedLeads.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">All Leads Processed!</h2>
          <p className="text-gray-600">
            You have processed all available leads. Great work!
          </p>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = ((currentIndex + 1) / unprocessedLeads.length) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Lead Processing Workflow</h2>
              <p className="text-gray-600">
                Review lead {currentIndex + 1} of {unprocessedLeads.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-crm-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lead Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {currentLead.ownerName}
            <Badge variant="outline" className="ml-auto">
              {currentLead.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
              
              {currentLead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{currentLead.phone}</span>
                </div>
              )}
              
              {currentLead.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{currentLead.email}</span>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                <span>{currentLead.propertyAddress}</span>
              </div>
            </div>

            {/* Property Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-3">Property Details</h3>
              
              {currentLead.taxId && (
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>Tax ID: {currentLead.taxId}</span>
                </div>
              )}
              
              {currentLead.currentArrears && (
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>Arrears: ${currentLead.currentArrears.toLocaleString()}</span>
                </div>
              )}
              
              {currentLead.taxLawsuitNumber && (
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>Lawsuit #: {currentLead.taxLawsuitNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {currentLead.notes && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Notes</h4>
              <p className="text-sm text-gray-700">{currentLead.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
            >
              Previous Lead
            </Button>

            <div className="flex gap-4">
              <Button
                variant="destructive"
                size="lg"
                onClick={() => handleAction('pass')}
                className="flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Pass
              </Button>
              
              <Button
                size="lg"
                onClick={() => handleAction('keep')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-5 h-5" />
                Keep
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={goToNext}
              disabled={currentIndex === unprocessedLeads.length - 1}
            >
              Next Lead
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
