
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { TaxLead } from '@/types/taxLead';
import { LeadStatusButtons } from './LeadStatusButtons';
import { ContactSection } from './detail/ContactSection';
import { PropertyInfoSection } from './detail/PropertyInfoSection';
import { FinancialInfoSection } from './detail/FinancialInfoSection';
import { NotesSection } from './detail/NotesSection';
import { AttachmentsSection } from './detail/AttachmentsSection';
import { AdditionalInformationSection } from './detail/AdditionalInformationSection';
import { ConditionalFieldsSection } from './detail/ConditionalFieldsSection';
import { Save, Eye, FileText, Phone, Mail, MapPin, DollarSign, FileIcon } from 'lucide-react';

interface TaxLeadDetailsFormProps {
  lead: TaxLead;
  onSave: (updatedLead: TaxLead) => void;
  userRole: 'admin' | 'editor' | 'viewer';
}

export function TaxLeadDetailsForm({ lead, onSave, userRole }: TaxLeadDetailsFormProps) {
  const [formData, setFormData] = useState<TaxLead>(lead);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const canEdit = userRole === 'admin' || userRole === 'editor';

  useEffect(() => {
    setFormData(lead);
    setHasChanges(false);
  }, [lead]);

  const handleFieldChange = (field: keyof TaxLead, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleLeadUpdate = (updatedLead: TaxLead) => {
    setFormData(updatedLead);
    setHasChanges(true);
  };

  const handleSave = () => {
    const updatedLead = {
      ...formData,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedLead);
    setHasChanges(false);
    setIsEditing(false);
    
    toast({
      title: "Lead Updated",
      description: "Lead information has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setFormData(lead);
    setHasChanges(false);
    setIsEditing(false);
  };

  const handleStatusChange = (status: 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP') => {
    handleFieldChange('status', status);
    handleFieldChange('temperature', status === 'PASS' ? 'COLD' : (status === 'KEEP' ? 'WARM' : status));
  };

  const handleFileUpload = (uploadedFiles: File[], category: string) => {
    // Handle file upload logic here
    console.log('Files uploaded:', uploadedFiles, 'Category:', category);
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = formData.attachedFiles?.filter(f => f.id !== fileId) || [];
    handleFieldChange('attachedFiles', updatedFiles);
  };

  // Add null check for lead data
  if (!lead) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lead information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{formData.ownerName}</h1>
              <p className="text-gray-600">{formData.propertyAddress}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1">
              Tax ID: {formData.taxId}
            </Badge>
            {!canEdit && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                View Only
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {canEdit && (
          <div className="flex items-center gap-3">
            {hasChanges && (
              <>
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Lead Status */}
      <LeadStatusButtons
        currentStatus={formData.status}
        onStatusChange={handleStatusChange}
        disabled={!canEdit}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Primary Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <ContactSection
            lead={formData}
            onLeadUpdate={handleLeadUpdate}
            onCall={(phone) => console.log('Call:', phone)}
            onSendText={(phone) => console.log('Text:', phone)}
            onEmail={(email) => console.log('Email:', email)}
          />

          {/* Property Information */}
          <PropertyInfoSection
            leadData={formData}
            onFieldUpdate={handleFieldChange}
          />

          {/* Financial Information */}
          <FinancialInfoSection
            leadData={formData}
            onFieldUpdate={(field, value) => handleFieldChange(field, value)}
          />
        </div>

        {/* Right Column - Secondary Information */}
        <div className="space-y-6">
          {/* Notes */}
          <NotesSection
            notes={[]}
            newNote=""
            onNewNoteChange={() => {}}
            onAddNote={() => {}}
            canEdit={canEdit}
          />

          {/* Attachments */}
          <AttachmentsSection
            files={formData.attachedFiles?.map(f => ({ 
              ...f, 
              category: 'other' as const,
              type: f.type || 'unknown'
            })) || []}
            onRemoveFile={handleRemoveFile}
            onFileUpload={handleFileUpload}
            canEdit={canEdit}
          />
        </div>
      </div>

      {/* Additional Information Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdditionalInformationSection
          formData={formData}
          files={[]}
          onInputChange={handleFieldChange}
          onFileUpload={handleFileUpload}
          onRemoveFile={handleRemoveFile}
          canEdit={canEdit}
        />

        <ConditionalFieldsSection
          lead={formData}
          onLeadUpdate={handleLeadUpdate}
          canEdit={canEdit}
        />
      </div>

      {/* Final Save Button */}
      {canEdit && hasChanges && (
        <div className="sticky bottom-6 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">You have unsaved changes</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
