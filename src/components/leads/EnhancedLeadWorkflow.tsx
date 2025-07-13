
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaxLeadDetailsForm } from './TaxLeadDetailsForm';
import { OwnershipBreakdown } from './OwnershipBreakdown';
import { LeadReviewCard } from './LeadReviewCard';
import { TaxLead } from '@/types/taxLead';
import { 
  FileText, 
  PieChart, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Home,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface EnhancedLeadWorkflowProps {
  lead: TaxLead;
  onLeadUpdate: (updatedLead: TaxLead) => void;
  userRole?: 'admin' | 'editor' | 'viewer';
}

export function EnhancedLeadWorkflow({ lead, onLeadUpdate, userRole = 'editor' }: EnhancedLeadWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<'review' | 'details' | 'ownership'>('review');
  const [workflowStatus, setWorkflowStatus] = useState<'pending' | 'in-progress' | 'complete'>('pending');

  const steps = [
    {
      id: 'review',
      title: 'Lead Review',
      description: 'Initial lead assessment',
      icon: FileText,
      status: lead.status !== 'PASS' ? 'completed' : 'pending'
    },
    {
      id: 'details',
      title: 'Detailed Information',
      description: 'Conditional fields and documentation',
      icon: CheckCircle,
      status: workflowStatus === 'complete' ? 'completed' : 'in-progress'
    },
    {
      id: 'ownership',
      title: 'Ownership Breakdown',
      description: 'Heir ownership distribution',
      icon: PieChart,
      status: 'pending'
    }
  ];

  const handleStepChange = (step: 'review' | 'details' | 'ownership') => {
    setCurrentStep(step);
  };

  const handleNext = () => {
    if (currentStep === 'review') {
      setCurrentStep('details');
      setWorkflowStatus('in-progress');
    } else if (currentStep === 'details') {
      setCurrentStep('ownership');
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'ownership') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('review');
    }
  };

  const getStepIcon = (step: typeof steps[0]) => {
    const Icon = step.icon;
    const statusColor = step.status === 'completed' ? 'text-green-600' : 
                       step.status === 'in-progress' ? 'text-blue-600' : 'text-gray-400';
    return <Icon className={`w-5 h-5 ${statusColor}`} />;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Workflow Progress Header */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Home className="w-6 h-6 text-crm-primary" />
            Lead Workflow - {lead.ownerName}
            <Badge variant="outline" className="ml-auto">
              Tax ID: {lead.taxId}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    currentStep === step.id 
                      ? 'bg-crm-primary text-white shadow-md' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => handleStepChange(step.id as any)}
                >
                  {getStepIcon(step)}
                  <div>
                    <div className="font-medium">{step.title}</div>
                    <div className="text-xs opacity-75">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="space-y-6">
        {currentStep === 'review' && (
          <div className="space-y-6">
            <LeadReviewCard 
              lead={lead} 
              onLeadUpdate={onLeadUpdate}
              onOpenDetailedForm={() => handleNext()}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleNext}
                className="bg-crm-primary hover:bg-crm-primary/90"
                disabled={lead.status === 'PASS'}
              >
                Continue to Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'details' && (
          <div className="space-y-6">
            <TaxLeadDetailsForm 
              lead={lead}
              onSave={onLeadUpdate}
              userRole={userRole}
            />
            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={handlePrevious}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Review
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-crm-primary hover:bg-crm-primary/90"
              >
                Continue to Ownership
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'ownership' && (
          <div className="space-y-6">
            <OwnershipBreakdown />
            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={handlePrevious}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Details
              </Button>
              <Button 
                onClick={() => setWorkflowStatus('complete')}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Workflow
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Sidebar */}
      <Card className="fixed right-6 top-1/2 transform -translate-y-1/2 w-64 shadow-xl border-0 z-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => handleStepChange('review')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Review Lead
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => handleStepChange('details')}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Lead Details
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => handleStepChange('ownership')}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Ownership
          </Button>
          
          <div className="pt-2 mt-2 border-t">
            <div className="text-xs text-gray-500 mb-2">Lead Status</div>
            <Badge 
              className={`w-full justify-center ${
                lead.status === 'HOT' ? 'bg-red-100 text-red-800' :
                lead.status === 'WARM' ? 'bg-yellow-100 text-yellow-800' :
                lead.status === 'COLD' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              {lead.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
