
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaxLead } from '@/types/taxLead';
import { TemplateModificationDialog } from './TemplateModificationDialog';
import { SellerContactSection } from './detail/SellerContactSection';
import { PropertyDetailsSection } from './detail/PropertyDetailsSection';
import { PropertyMapSection } from './detail/PropertyMapSection';
import { NotesDisplaySection } from './detail/NotesDisplaySection';
import { DatabaseActivityTimeline } from './DatabaseActivityTimeline';
import { LeadDetailsHeader } from './detail/LeadDetailsHeader';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedActivityLogger } from '@/hooks/useEnhancedActivityLogger';

interface LeadDetailsPageProps {
  lead: TaxLead;
  onBack: () => void;
  onLeadUpdate: (updatedLead: TaxLead) => void;
}

export function LeadDetailsPage({ lead, onBack, onLeadUpdate }: LeadDetailsPageProps) {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [leadData, setLeadData] = useState<TaxLead>(lead);
  const [disposition, setDisposition] = useState<'keep' | 'pass' | null>(null);
  const { toast } = useToast();
  const { logLeadActivity } = useEnhancedActivityLogger();

  // Update local state when lead prop changes
  useEffect(() => {
    setLeadData(lead);
  }, [lead]);

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
    
    // Log call activity
    logLeadActivity({
      actionType: 'call',
      description: `Initiated call to ${phoneNumber} for ${leadData.ownerName || 'Unknown'}`,
      referenceId: leadData.id.toString(),
      metadata: {
        leadId: leadData.id,
        phoneNumber: phoneNumber,
        ownerName: leadData.ownerName
      }
    });
  };

  const handleSendText = (phoneNumber: string) => {
    window.open(`sms:${phoneNumber}`, '_self');
    
    // Log SMS activity
    logLeadActivity({
      actionType: 'sms',
      description: `Sent SMS to ${phoneNumber} for ${leadData.ownerName || 'Unknown'}`,
      referenceId: leadData.id.toString(),
      metadata: {
        leadId: leadData.id,
        phoneNumber: phoneNumber,
        ownerName: leadData.ownerName
      }
    });
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
    
    // Log email activity
    logLeadActivity({
      actionType: 'email',
      description: `Sent email to ${email} for ${leadData.ownerName || 'Unknown'}`,
      referenceId: leadData.id.toString(),
      metadata: {
        leadId: leadData.id,
        email: email,
        ownerName: leadData.ownerName
      }
    });
  };

  const handleFieldUpdate = async (field: keyof TaxLead, value: string) => {
    const originalValue = leadData[field];
    const updatedLead = { ...leadData, [field]: value };
    
    // Update local state immediately
    setLeadData(updatedLead);
    
    // Check if this affects disposition
    if (field === 'status') {
      if (value === 'KEEP') {
        setDisposition('keep');
      } else if (value === 'PASS') {
        setDisposition('pass');
      }
    }
    
    // Update the parent component
    await onLeadUpdate(updatedLead);
    
    console.log('Field updated:', field, 'from', originalValue, 'to', value);
  };

  const handleBackClick = () => {
    onBack();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HOT': return 'bg-red-100 text-red-800 border-red-200';
      case 'WARM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COLD': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PASS': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-podio-surface">
      <div className="max-w-7xl mx-auto">
        <LeadDetailsHeader
          lead={leadData}
          onBack={handleBackClick}
          onEditClick={() => setIsTemplateDialogOpen(true)}
          getStatusColor={getStatusColor}
        />

        <div className="p-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-podio-background border border-podio-border rounded-lg p-1">
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:bg-podio-primary data-[state=active]:text-white rounded-md"
              >
                Lead Details
              </TabsTrigger>
              <TabsTrigger 
                value="activity"
                className="data-[state=active]:bg-podio-primary data-[state=active]:text-white rounded-md"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <SellerContactSection
                    lead={leadData}
                    onFieldUpdate={handleFieldUpdate}
                    canEdit={true}
                  />

                  <PropertyDetailsSection 
                    lead={leadData} 
                    onLeadUpdate={handleFieldUpdate}
                  />
                </div>

                <div className="space-y-6">
                  <PropertyMapSection address={leadData.propertyAddress} />

                  {leadData.notes && (
                    <NotesDisplaySection notes={leadData.notes} />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6 mt-6">
              <DatabaseActivityTimeline 
                lead={leadData}
                readOnly={false}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <TemplateModificationDialog
        isOpen={isTemplateDialogOpen}
        onClose={() => setIsTemplateDialogOpen(false)}
        lead={leadData}
        onSave={async (updatedLead) => {
          setLeadData(updatedLead);
          await onLeadUpdate(updatedLead);
          
          // Log template modification activity
          await logLeadActivity({
            actionType: 'updated',
            description: `Modified lead template for ${updatedLead.ownerName || 'Unknown'}`,
            referenceId: updatedLead.id.toString(),
            metadata: {
              leadId: updatedLead.id,
              ownerName: updatedLead.ownerName,
              modificationType: 'template'
            }
          });
        }}
      />
    </div>
  );
}
