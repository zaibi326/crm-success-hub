
import React from 'react';
import { TaxLead } from '@/types/taxLead';
import { DispositionSection } from './DispositionSection';
import { NotesSection } from './NotesSection';
import { EditableFieldsSection } from './EditableFieldsSection';
import { ConditionalFieldsSection } from './ConditionalFieldsSection';
import { EnhancedSellerContactSection } from './EnhancedSellerContactSection';
import { EnhancedAdditionalInfoSection } from './EnhancedAdditionalInfoSection';
import { EnhancedOwnershipSection } from './EnhancedOwnershipSection';
import { EnhancedLeadDetailsSection } from './EnhancedLeadDetailsSection';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities';
}

interface NoteEntry {
  id: string;
  text: string;
  timestamp: Date;
  userName: string;
}

interface MainContentProps {
  formData: TaxLead;
  disposition: 'keep' | 'pass' | null;
  passReason: string;
  notes: NoteEntry[];
  newNote: string;
  files: UploadedFile[];
  canEdit: boolean;
  onInputChange: (field: keyof TaxLead, value: any) => void;
  onDisposition: (disp: 'keep' | 'pass') => void;
  onPassReasonChange: (reason: string) => void;
  onNewNoteChange: (note: string) => void;
  onAddNote: () => void;
  onFileUpload: (files: File[], category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities') => void;
  onRemoveFile: (fileId: string) => void;
}

export function MainContent({
  formData,
  disposition,
  passReason,
  notes,
  newNote,
  files,
  canEdit,
  onInputChange,
  onDisposition,
  onPassReasonChange,
  onNewNoteChange,
  onAddNote,
  onFileUpload,
  onRemoveFile
}: MainContentProps) {
  const handleOwnershipSave = (heirs: any[]) => {
    console.log('Heirs saved:', heirs);
    // Here you would typically save the heirs data to your backend
    // For now, we'll just log it
  };

  const handleLeadUpdate = (updatedLead: TaxLead) => {
    // Update individual fields
    Object.keys(updatedLead).forEach(key => {
      const field = key as keyof TaxLead;
      if (updatedLead[field] !== formData[field]) {
        onInputChange(field, updatedLead[field]);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Seller Contact Section - NO attachments here */}
      <EnhancedSellerContactSection
        lead={formData}
        onFieldUpdate={onInputChange}
        canEdit={canEdit}
      />

      {/* Step 2: Lead Details Section */}
      <EnhancedLeadDetailsSection 
        lead={formData} 
        onFieldUpdate={onInputChange} 
        canEdit={canEdit} 
      />

      {/* Step 3: Disposition Section */}
      <DispositionSection
        disposition={disposition}
        passReason={passReason}
        canEdit={canEdit}
        onDisposition={onDisposition}
        onPassReasonChange={onPassReasonChange}
      />

      {/* Step 4: Conditional rendering based on disposition */}
      {disposition === 'keep' && (
        <>
          {/* Editable Fields Section */}
          <EditableFieldsSection
            formData={formData}
            canEdit={canEdit}
            onInputChange={onInputChange}
          />

          {/* Additional Information Section */}
          <EnhancedAdditionalInfoSection
            formData={formData}
            onInputChange={onInputChange}
            canEdit={canEdit}
          />

          {/* Conditional Fields Section - Only vesting deed specific uploads */}
          <ConditionalFieldsSection
            lead={formData}
            onLeadUpdate={handleLeadUpdate}
            canEdit={canEdit}
          />

          {/* Enhanced Ownership Section */}
          <EnhancedOwnershipSection
            lead={formData}
            canEdit={canEdit}
            onSave={handleOwnershipSave}
          />
        </>
      )}

      {/* Step 5: If disposition is 'pass', show Notes Section */}
      {disposition === 'pass' && (
        <NotesSection
          notes={notes}
          newNote={newNote}
          canEdit={canEdit}
          onNewNoteChange={onNewNoteChange}
          onAddNote={onAddNote}
        />
      )}

      {/* Step 6: If no disposition is selected, show Notes Section for general notes */}
      {disposition === null && (
        <NotesSection
          notes={notes}
          newNote={newNote}
          canEdit={canEdit}
          onNewNoteChange={onNewNoteChange}
          onAddNote={onAddNote}
        />
      )}
    </div>
  );
}
