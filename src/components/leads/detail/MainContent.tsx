
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
      {/* Lead Details Section */}
      <EnhancedSellerContactSection
        lead={formData}
        onFieldUpdate={onInputChange}
        canEdit={canEdit}
      />

      <DispositionSection
        disposition={disposition}
        passReason={passReason}
        onDisposition={onDisposition}
        onPassReasonChange={onPassReasonChange}
        canEdit={canEdit}
      />

      {disposition === 'keep' && (
        <>
          <EditableFieldsSection
            formData={formData}
            onInputChange={onInputChange}
            canEdit={canEdit}
          />

          <ConditionalFieldsSection
            formData={formData}
            files={files.filter(f => f.category === 'vesting_deed')}
            onInputChange={onInputChange}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
            canEdit={canEdit}
          />

          <EnhancedAdditionalInfoSection
            formData={formData}
            onInputChange={onInputChange}
            canEdit={canEdit}
          />

          {/* Enhanced Ownership Section with Heirs Management */}
          <EnhancedOwnershipSection 
            lead={formData}
            onSave={handleOwnershipSave}
            canEdit={canEdit}
          />

          {/* Attachments Section */}
          <AttachmentsSection
            files={files}
            onRemoveFile={onRemoveFile}
            onFileUpload={onFileUpload}
            canEdit={canEdit}
            title="Lead Attachments"
            description="Upload documents related to this lead"
          />

          <NotesSection
            notes={notes}
            newNote={newNote}
            onNewNoteChange={onNewNoteChange}
            onAddNote={onAddNote}
            canEdit={canEdit}
          />
        </>
      )}
    </div>
  );
}
