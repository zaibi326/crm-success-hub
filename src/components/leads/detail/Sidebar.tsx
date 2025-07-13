
import React from 'react';
import { LeadStatusButtons } from '../LeadStatusButtons';
import { AttachmentsSection } from './AttachmentsSection';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  category: 'probate' | 'vesting_deed' | 'other';
}

interface SidebarProps {
  currentStatus: 'HOT' | 'WARM' | 'COLD' | 'PASS';
  files: UploadedFile[];
  canEdit: boolean;
  onStatusChange: (status: 'HOT' | 'WARM' | 'COLD' | 'PASS') => void;
  onRemoveFile: (fileId: string) => void;
}

export function Sidebar({
  currentStatus,
  files,
  canEdit,
  onStatusChange,
  onRemoveFile
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
        canEdit={canEdit}
      />
    </div>
  );
}
