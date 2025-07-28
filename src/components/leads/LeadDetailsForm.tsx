
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TaxLead } from '@/types/taxLead';
import { ContactInfoSection } from './ContactInfoSection';
import { LegalInfoSection } from './LegalInfoSection';
import { NotesSection } from './NotesSection';

interface LeadDetailsFormProps {
  lead: TaxLead;
  onSave: (updatedLead: TaxLead) => void;
  canEdit: boolean;
}

interface LocalUploadedFile {
  id: string;
  name: string;
  type?: string;
  url: string;
  preview?: string;
}

export function LeadDetailsForm({ lead, onSave, canEdit }: LeadDetailsFormProps) {
  const [formData, setFormData] = useState(lead);
  const [files, setFiles] = useState<LocalUploadedFile[]>([]);
  const [isContactOpen, setIsContactOpen] = useState(true);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof TaxLead, value: any) => {
    if (!canEdit) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return;
    
    const uploadedFiles = Array.from(event.target.files || []);
    
    uploadedFiles.forEach(file => {
      const fileUrl = URL.createObjectURL(file);
      const newFile: LocalUploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        url: fileUrl,
        preview: file.type.startsWith('image/') ? fileUrl : undefined
      };
      
      setFiles(prev => [...prev, newFile]);
    });
    
    toast({
      title: "Files uploaded",
      description: `${uploadedFiles.length} file(s) added successfully`,
    });
  };

  const removeFile = (fileId: string) => {
    if (!canEdit) return;
    
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File removed",
      description: "File has been removed from the lead",
    });
  };

  const handleSave = async () => {
    if (!canEdit) return;
    
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(formData);
    
    toast({
      title: "Lead Updated! ✅",
      description: "All changes have been saved successfully.",
    });
    
    setIsSaving(false);
  };

  // Create a ContactInfoSection that works with TaxLead
  const TaxLeadContactInfoSection = ({ 
    formData, 
    isOpen, 
    onToggle, 
    onInputChange 
  }: {
    formData: TaxLead;
    isOpen: boolean;
    onToggle: (open: boolean) => void;
    onInputChange: (field: keyof TaxLead, value: any) => void;
  }) => (
    <ContactInfoSection
      formData={{
        ...formData,
        name: formData.ownerName,
        company: '',
        position: '',
        address: formData.propertyAddress,
        city: '',
        state: '',
        zip: '',
        avatar: undefined,
        tags: formData.tags || [],
        score: 0
      }}
      isOpen={isOpen}
      onToggle={onToggle}
      onInputChange={(field, value) => {
        if (field === 'name') {
          onInputChange('ownerName', value);
        } else if (field === 'address') {
          onInputChange('propertyAddress', value);
        } else if (field === 'email') {
          onInputChange('email', value);
        } else if (field === 'phone') {
          onInputChange('phone', value);
        } else if (field === 'notes') {
          onInputChange('notes', value);
        }
      }}
    />
  );

  // Create a NotesSection that works with TaxLead
  const TaxLeadNotesSection = ({ 
    formData, 
    isOpen, 
    onToggle, 
    onInputChange 
  }: {
    formData: TaxLead;
    isOpen: boolean;
    onToggle: (open: boolean) => void;
    onInputChange: (field: keyof TaxLead, value: any) => void;
  }) => (
    <NotesSection
      formData={{
        ...formData,
        name: formData.ownerName,
        company: '',
        position: '',
        address: formData.propertyAddress,
        city: '',
        state: '',
        zip: '',
        avatar: undefined,
        tags: formData.tags || [],
        score: 0
      }}
      isOpen={isOpen}
      onToggle={onToggle}
      onInputChange={(field, value) => {
        if (field === 'notes') {
          onInputChange('notes', value);
        }
      }}
    />
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {!canEdit && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            You have view-only access to this lead. Contact your manager to request edit permissions.
          </p>
        </div>
      )}

      <TaxLeadContactInfoSection
        formData={formData}
        isOpen={isContactOpen}
        onToggle={setIsContactOpen}
        onInputChange={handleInputChange}
      />

      <LegalInfoSection
        isOpen={isLegalOpen}
        onToggle={setIsLegalOpen}
        files={files.map(f => ({ ...f, type: f.type || 'unknown' }))}
        onFileUpload={handleFileUpload}
        onRemoveFile={removeFile}
      />

      <TaxLeadNotesSection
        formData={formData}
        isOpen={isNotesOpen}
        onToggle={setIsNotesOpen}
        onInputChange={handleInputChange}
      />

      {/* Sticky Save Button - Only show if user can edit */}
      {canEdit && (
        <div className="sticky bottom-6 z-10 flex justify-center">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-crm-primary to-crm-accent hover:from-crm-primary/90 hover:to-crm-accent/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
