
import React from 'react';
import { LeadStatusButtons } from '../LeadStatusButtons';
import { AttachmentsSection } from './AttachmentsSection';
import { TaxLead } from '@/types/taxLead';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities';
}

interface SidebarProps {
  currentStatus: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  files: UploadedFile[];
  canEdit: boolean;
  onStatusChange: (status: 'HOT' | 'WARM' | 'COLD' | 'PASS') => void;
  onRemoveFile: (fileId: string) => void;
  onFileUpload?: (files: File[], category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities') => void;
}

export function Sidebar({
  currentStatus,
  files = [], // Default to empty array
  canEdit,
  onStatusChange,
  onRemoveFile,
  onFileUpload
}: SidebarProps) {
  return (
    <div className="space-y-6">
      <LeadStatusButtons
        currentStatus={currentStatus}
        onStatusChange={onStatusChange}
        disabled={!canEdit}
      />

      <AttachmentsSection
        files={files}
        onRemoveFile={onRemoveFile}
        onFileUpload={onFileUpload}
        canEdit={canEdit}
      />
    </div>
  );
}
