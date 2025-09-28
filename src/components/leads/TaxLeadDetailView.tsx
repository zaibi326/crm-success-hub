
import React, { useEffect } from 'react';
import { TaxLead } from '@/types/taxLead';
import { TaxLeadDetailsForm } from './TaxLeadDetailsForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { useNavigate } from 'react-router-dom';

interface TaxLeadDetailViewProps {
  selectedLead: TaxLead;
  onBack: () => void;
}

export function TaxLeadDetailView({ selectedLead, onBack }: TaxLeadDetailViewProps) {
  const { logActivity } = useActivityLogger();
  const navigate = useNavigate();

  // Log when user views a lead (only once per lead view, not on status changes)
  useEffect(() => {
    logActivity({
      module: 'leads',
      actionType: 'viewed',
      description: `Viewed lead details for ${selectedLead.ownerName}`,
      referenceId: selectedLead.id.toString(),
      referenceType: 'lead',
      metadata: {
        leadId: selectedLead.id,
        ownerName: selectedLead.ownerName,
        propertyAddress: selectedLead.propertyAddress
      }
    });
  }, [selectedLead.id, selectedLead.ownerName, logActivity]); // Removed status from dependencies

  const handleSave = (updatedLead: TaxLead) => {
    console.log('Lead updated:', updatedLead);
    
    // Log the lead update activity
    logActivity({
      module: 'leads',
      actionType: 'updated',
      description: `Updated lead information for ${updatedLead.ownerName}`,
      referenceId: updatedLead.id.toString(),
      referenceType: 'lead',
      metadata: {
        leadId: updatedLead.id,
        ownerName: updatedLead.ownerName,
        status: updatedLead.status,
        previousStatus: selectedLead.status
      }
    });
  };

  const handleBackClick = () => {
    // Call the onBack function first
    onBack();
    // Then navigate to the leads page, replacing the current history entry
    navigate('/leads', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBackClick}
                className="flex items-center gap-2 text-crm-primary hover:text-crm-accent hover:bg-crm-primary/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Leads
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedLead.ownerName}</h1>
                <p className="text-gray-600 mt-1">{selectedLead.propertyAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Lead Details Form */}
        <div className="pb-6">
          <TaxLeadDetailsForm
            lead={selectedLead}
            onSave={handleSave}
            userRole="editor"
          />
        </div>
      </div>
    </div>
  );
}
