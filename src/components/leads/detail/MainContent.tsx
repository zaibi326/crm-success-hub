
import React from 'react';
import { TaxLead } from '@/types/taxLead';
import { DispositionSection } from './DispositionSection';
import { NotesSection } from './NotesSection';
import { EditableFieldsSection } from './EditableFieldsSection';
import { ConditionalFieldsSection } from './ConditionalFieldsSection';
import { EnhancedSellerContactSection } from './EnhancedSellerContactSection';
import { EnhancedAdditionalInfoSection } from './EnhancedAdditionalInfoSection';
import { EnhancedOwnershipSection } from './EnhancedOwnershipSection';
import { AttachmentsSection } from './AttachmentsSection';
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

  return (
    <div className="space-y-6">
      {/* Disposition Section */}
      <DispositionSection
        disposition={disposition}
        passReason={passReason}
        canEdit={canEdit}
        onDisposition={onDisposition}
        onPassReasonChange={onPassReasonChange}
      />

      {/* Notes Section */}
      <NotesSection
        notes={notes}
        newNote={newNote}
        canEdit={canEdit}
        onNewNoteChange={onNewNoteChange}
        onAddNote={onAddNote}
      />

      {/* Enhanced Seller Contact Section */}
      <EnhancedSellerContactSection
        lead={formData}
        onFieldUpdate={onInputChange}
        canEdit={canEdit}
      />

      {/* Enhanced Lead Details Section - Below Seller Contact */}
      <EnhancedLeadDetailsSection 
        lead={formData} 
        onFieldUpdate={onInputChange} 
        canEdit={canEdit} 
      />

      {/* Editable Fields Section */}
      <EditableFieldsSection
        formData={formData}
        canEdit={canEdit}
        onInputChange={onInputChange}
      />

      {/* Enhanced Additional Info Section - Above Conditional Fields */}
      <EnhancedAdditionalInfoSection
        formData={formData}
        onInputChange={onInputChange}
        canEdit={canEdit}
      />

      {/* Conditional Fields Section */}
      <ConditionalFieldsSection
        formData={formData}
        files={files}
        canEdit={canEdit}
        onInputChange={onInputChange}
        onFileUpload={onFileUpload}
        onRemoveFile={onRemoveFile}
      />

      {/* Lead Attachments Section */}
      <AttachmentsSection
        files={files}
        onRemoveFile={onRemoveFile}
        onFileUpload={onFileUpload}
        canEdit={canEdit}
        title="Lead Attachments"
        description="Upload documents related to this lead"
      />

      {/* Enhanced Ownership Section */}
      <EnhancedOwnershipSection
        lead={formData}
        canEdit={canEdit}
        onSave={handleOwnershipSave}
      />
    </div>
  );
}
