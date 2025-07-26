import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Edit, CheckCircle, XCircle } from 'lucide-react';
import { LeadDetailsForm } from './LeadDetailsForm';
import { TaxLead } from '@/types/taxLead';
import { useToast } from '@/hooks/use-toast';
import { convertTaxLeadToLead } from '@/types/lead';

interface LeadReviewSystemProps {
  leads: TaxLead[];
  onLeadUpdate: (updatedLead: TaxLead) => void;
  onReviewComplete: () => void;
  canEdit: boolean;
}

export function LeadReviewSystem({ leads, onLeadUpdate, onReviewComplete, canEdit }: LeadReviewSystemProps) {
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (leads.length === 0) {
      toast({
        title: "No Leads to Review",
        description: "There are currently no leads available for review.",
      });
      onReviewComplete();
    }
  }, [leads, onReviewComplete, toast]);

  const currentLead = leads[currentLeadIndex];

  const handleNextLead = () => {
    if (currentLeadIndex < leads.length - 1) {
      setCurrentLeadIndex(currentLeadIndex + 1);
    } else {
      toast({
        title: "Review Complete",
        description: "You have reviewed all leads.",
      });
      onReviewComplete();
    }
  };

  const handlePreviousLead = () => {
    if (currentLeadIndex > 0) {
      setCurrentLeadIndex(currentLeadIndex - 1);
    }
  };

  const handleApproveLead = () => {
    toast({
      title: "Lead Approved",
      description: `Lead ${currentLead.ownerName} has been approved.`,
    });
    handleNextLead();
  };

  const handleRejectLead = () => {
    toast({
      title: "Lead Rejected",
      description: `Lead ${currentLead.ownerName} has been rejected.`,
    });
    handleNextLead();
  };

  if (!currentLead) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-semibold mb-4">No Leads to Review</h2>
        <p className="text-gray-600">Please check back later.</p>
        <Button onClick={onReviewComplete} className="mt-4">
          Return to Leads
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Reviewing Lead {currentLeadIndex + 1} of {leads.length}</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handlePreviousLead} disabled={currentLeadIndex === 0} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={handleNextLead} disabled={currentLeadIndex === leads.length - 1}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 border">
        <LeadDetailsForm
          lead={convertTaxLeadToLead(currentLead)}
          onSave={(updatedLead) => {
            // Convert back to TaxLead format
            const updatedTaxLead: TaxLead = {
              ...currentLead,
              ownerName: updatedLead.name,
              email: updatedLead.email,
              phone: updatedLead.phone,
              propertyAddress: updatedLead.address,
              notes: updatedLead.notes,
              status: updatedLead.status === 'PASS' ? 'PASS' : updatedLead.status as any,
              tags: updatedLead.tags,
              updatedAt: new Date().toISOString()
            };
            onLeadUpdate(updatedTaxLead);
          }}
          canEdit={canEdit}
        />
      </div>

      <div className="flex justify-between mt-4">
        <Button
          variant="ghost"
          className="bg-green-500 text-white hover:bg-green-700"
          onClick={handleApproveLead}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Approve
        </Button>
        <Button
          variant="ghost"
          className="bg-red-500 text-white hover:bg-red-700"
          onClick={handleRejectLead}
        >
          <XCircle className="w-4 h-4 mr-2" />
          Reject
        </Button>
      </div>
    </div>
  );
}
