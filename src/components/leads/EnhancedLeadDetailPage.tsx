import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit,
  ArrowLeft,
  MapPin,
  Paperclip
} from 'lucide-react';
import { TaxLead } from '@/types/taxLead';
import { PropertyMap } from './PropertyMap';
import { TemplateModificationDialog } from './TemplateModificationDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalInfoSection } from './detail/PersonalInfoSection';
import { PropertyInfoSection } from './detail/PropertyInfoSection';
import { FinancialInfoSection } from './detail/FinancialInfoSection';
import { LeadInfoSection } from './detail/LeadInfoSection';
import { DatabaseActivityTimeline } from './DatabaseActivityTimeline';
import { EnhancedOwnershipSection } from './detail/EnhancedOwnershipSection';
import { EnhancedSellerContactSection } from './detail/EnhancedSellerContactSection';

interface EnhancedLeadDetailPageProps {
  lead: TaxLead;
  onBack: () => void;
  onLeadUpdate: (updatedLead: TaxLead) => void;
}

export function EnhancedLeadDetailPage({ lead, onBack, onLeadUpdate }: EnhancedLeadDetailPageProps) {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [leadData, setLeadData] = useState<TaxLead>({
    ...lead,
    firstName: lead.firstName || '',
    lastName: lead.lastName || '',
    temperature: lead.temperature || 'WARM',
    occupancyStatus: lead.occupancyStatus || 'OWNER_OCCUPIED'
  });

  const { toast } = useToast();

  // Single handler for all field updates
  const handleFieldUpdate = async (field: keyof TaxLead, value: string) => {
    const updatedLead = { ...leadData, [field]: value };
    setLeadData(updatedLead);
    
    try {
      await onLeadUpdate(updatedLead);
      console.log(`${field} updated to:`, value);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update ${field}`,
        variant: "destructive",
      });
    }
  };

  const handleOwnershipSave = (heirs: any[]) => {
    console.log('Heirs saved:', heirs);
    toast({
      title: "Ownership Saved",
      description: "Heirs and ownership details have been saved successfully",
    });
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

  const getTemperatureIcon = (temp: string) => {
    switch (temp) {
      case 'HOT': return '🔥';
      case 'WARM': return '🌤️';
      case 'COLD': return '❄️';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center gap-2 text-crm-primary hover:text-crm-accent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Leads
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {leadData.firstName} {leadData.lastName}
              </h1>
              <p className="text-gray-600">{leadData.propertyAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(leadData.temperature)}>
              {getTemperatureIcon(leadData.temperature)} {leadData.temperature}
            </Badge>
            <Button 
              variant="outline"
              onClick={() => setIsTemplateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Lead
            </Button>
          </div>
        </div>

        {/* Tabs for Details, Ownership, and Activity */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="ownership">Ownership & Heirs</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Lead Details Section */}
                <EnhancedSellerContactSection 
                  lead={leadData}
                  onFieldUpdate={handleFieldUpdate}
                  canEdit={true}
                />
                
                {/* Other Detail Sections */}
                <PersonalInfoSection 
                  leadData={leadData} 
                  onFieldUpdate={handleFieldUpdate} 
                />
                
                <PropertyInfoSection 
                  leadData={leadData} 
                  onFieldUpdate={handleFieldUpdate} 
                />

                <FinancialInfoSection 
                  leadData={leadData} 
                  onFieldUpdate={handleFieldUpdate} 
                />

                <LeadInfoSection 
                  leadData={leadData} 
                  onFieldUpdate={handleFieldUpdate} 
                />
              </div>

              {/* Right Column - Map */}
              <div className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-crm-primary" />
                      Property Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PropertyMap address={leadData.propertyAddress} />
                  </CardContent>
                </Card>

                {/* Notes */}
                {leadData.notes && (
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{leadData.notes}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Attached Files */}
                {leadData.attachedFiles && leadData.attachedFiles.length > 0 && (
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Paperclip className="w-5 h-5 text-crm-primary" />
                        Attached Files
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {leadData.attachedFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Paperclip className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ownership" className="space-y-6 mt-6">
            <EnhancedOwnershipSection 
              lead={leadData}
              onSave={handleOwnershipSave}
              canEdit={true}
            />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6 mt-6">
            <DatabaseActivityTimeline 
              lead={leadData}
              readOnly={false}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Template Modification Dialog */}
      <TemplateModificationDialog
        isOpen={isTemplateDialogOpen}
        onClose={() => setIsTemplateDialogOpen(false)}
        lead={leadData}
        onSave={onLeadUpdate}
      />
    </div>
  );
}
