
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaxLead } from '@/types/taxLead';
import { TemplateModificationDialog } from './TemplateModificationDialog';
import { ContactSection } from './detail/ContactSection';
import { PropertyDetailsSection } from './detail/PropertyDetailsSection';
import { PropertyMapSection } from './detail/PropertyMapSection';
import { NotesDisplaySection } from './detail/NotesDisplaySection';
import { DatabaseActivityTimeline } from './DatabaseActivityTimeline';
import { LeadDetailsHeader } from './detail/LeadDetailsHeader';
import { SaveButton } from './detail/SaveButton';
import { useToast } from '@/hooks/use-toast';

interface LeadDetailsPageProps {
  lead: TaxLead;
  onBack: () => void;
  onLeadUpdate: (updatedLead: TaxLead) => void;
}

export function LeadDetailsPage({ lead, onBack, onLeadUpdate }: LeadDetailsPageProps) {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [leadData, setLeadData] = useState<TaxLead>(lead);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [disposition, setDisposition] = useState<'keep' | 'pass' | null>(null);
  const { toast } = useToast();

  // Update local state when lead prop changes
  useEffect(() => {
    setLeadData(lead);
    setHasChanges(false);
  }, [lead]);
  
  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleSendText = (phoneNumber: string) => {
    window.open(`sms:${phoneNumber}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  const handleFieldUpdate = (field: keyof TaxLead, value: string) => {
    const updatedLead = { ...leadData, [field]: value };
    setLeadData(updatedLead);
    setHasChanges(true);
    
    // Check if this affects disposition
    if (field === 'status') {
      if (value === 'KEEP') {
        setDisposition('keep');
      } else if (value === 'PASS') {
        setDisposition('pass');
      }
    }
    
    console.log('Field updated:', field, value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onLeadUpdate(leadData);
      setHasChanges(false);
      toast({
        title: "Success",
        description: "Lead details saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save lead details",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
          onBack={onBack}
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
                  <ContactSection
                    lead={leadData}
                    onCall={handleCall}
                    onSendText={handleSendText}
                    onEmail={handleEmail}
                    onLeadUpdate={handleFieldUpdate}
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

              {/* Save Button - Show when there are changes */}
              {hasChanges && (
                <SaveButton
                  onSave={handleSave}
                  isSaving={isSaving}
                  canEdit={true}
                  disposition={disposition}
                />
              )}
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
        onSave={(updatedLead) => {
          setLeadData(updatedLead);
          setHasChanges(true);
          onLeadUpdate(updatedLead);
        }}
      />
    </div>
  );
}
