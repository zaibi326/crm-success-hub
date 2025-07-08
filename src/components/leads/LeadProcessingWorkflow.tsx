import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { TaxLead } from '@/types/taxLead';
import { LeadReviewCard } from './LeadReviewCard';
import { TaxLeadDetailsForm } from './TaxLeadDetailsForm';
import { ReviewProgress } from './ReviewProgress';
import { ArrowRight, ArrowLeft, CheckCircle, X } from 'lucide-react';

interface LeadProcessingWorkflowProps {
  leads: TaxLead[];
  onLeadUpdate: (updatedLead: TaxLead) => void;
  onComplete?: () => void;
}

export function LeadProcessingWorkflow({ leads, onLeadUpdate, onComplete }: LeadProcessingWorkflowProps) {
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const currentLead = leads[currentLeadIndex];
  const isLastLead = currentLeadIndex === leads.length - 1;

  const handleLeadAction = async (action: 'pass' | 'keep') => {
    if (!currentLead) return;

    setIsProcessing(true);

    try {
      if (action === 'pass') {
        // Mark lead as passed and retain notes
        const updatedLead = {
          ...currentLead,
          status: 'PASS' as const
        };
        
        onLeadUpdate(updatedLead);
        
        toast({
          title: "Lead Passed",
          description: `${currentLead.ownerName} has been marked as passed. Notes retained.`,
        });

        // Auto-load next lead
        await moveToNextLead();
      } else {
        // Keep lead - proceed to detailed information entry
        setShowDetailedForm(true);
        
        toast({
          title: "Lead Kept",
          description: "Please fill in the detailed information.",
        });
      }
    } catch (error) {
      console.error('Error processing lead:', error);
      toast({
        title: "Error",
        description: "Failed to process lead. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDetailedFormSave = async (updatedLead: TaxLead) => {
    onLeadUpdate(updatedLead);
    setShowDetailedForm(false);
    
    toast({
      title: "Lead Information Saved! ✅",
      description: `Detailed information for ${updatedLead.ownerName} has been saved.`,
    });

    // Auto-load next lead
    await moveToNextLead();
  };

  const moveToNextLead = async () => {
    if (isLastLead) {
      toast({
        title: "Processing Complete! 🎉",
        description: "You've processed all leads in the queue.",
      });
      onComplete?.();
    } else {
      setCurrentLeadIndex(prev => prev + 1);
    }
  };

  const moveToPreviousLead = () => {
    if (currentLeadIndex > 0) {
      setCurrentLeadIndex(prev => prev - 1);
      setShowDetailedForm(false);
    }
  };

  if (!currentLead) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No leads to process</h3>
        <p className="text-gray-600">All leads have been processed or there are no leads available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Progress Indicator */}
      <ReviewProgress 
        currentIndex={currentLeadIndex} 
        totalLeads={leads.length}
      />

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={moveToPreviousLead}
          disabled={currentLeadIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Lead
        </Button>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Processing: {currentLead.ownerName}
          </h2>
          <p className="text-sm text-gray-600">
            Lead {currentLeadIndex + 1} of {leads.length}
          </p>
        </div>

        <div className="w-32"></div> {/* Spacer for alignment */}
      </div>

      {!showDetailedForm ? (
        /* Lead Review Phase */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LeadReviewCard
              lead={currentLead}
              onLeadUpdate={onLeadUpdate}
              onOpenDetailedForm={() => setShowDetailedForm(true)}
            />
          </div>

          <div className="space-y-4">
            {/* Action Buttons */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <CardTitle className="text-xl text-center text-gray-900">Lead Decision</CardTitle>
                <p className="text-center text-gray-600 text-sm">Choose your action for this lead</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => handleLeadAction('keep')}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white h-16 text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6 mr-3" />
                      KEEP LEAD
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => handleLeadAction('pass')}
                  disabled={isProcessing}
                  variant="outline"
                  className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 h-16 text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  <X className="w-6 h-6 mr-3" />
                  PASS ON LEAD
                </Button>
              </CardContent>
            </Card>

            {/* Lead Status Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-crm-primary to-crm-accent text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {leads.length - currentLeadIndex}
                  </div>
                  <div className="text-sm opacity-90">
                    Leads Remaining
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Detailed Information Entry Phase */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowDetailedForm(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Review
            </Button>
            
            <h2 className="text-xl font-semibold text-gray-900">
              Detailed Information - {currentLead.ownerName}
            </h2>
            
            <div className="w-32"></div> {/* Spacer */}
          </div>

          <TaxLeadDetailsForm
            lead={currentLead}
            onSave={handleDetailedFormSave}
            userRole="editor"
          />
        </div>
      )}
    </div>
  );
}
