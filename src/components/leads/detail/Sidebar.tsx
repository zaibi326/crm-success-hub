
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { AttachmentsSection } from './AttachmentsSection';

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
  onFileUpload: (files: File[], category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities') => void;
}

export function Sidebar({
  files,
  canEdit,
  onRemoveFile,
  onFileUpload
}: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* Lead Summary Card */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-crm-primary" />
            Lead Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="font-medium">Today</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Files:</span>
              <span className="font-medium">{files.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments Section - Below Lead Summary */}
      <AttachmentsSection
        files={files}
        onRemoveFile={onRemoveFile}
        onFileUpload={onFileUpload}
        canEdit={canEdit}
        title="Attachments"
        description="Upload documents related to this lead"
      />
    </div>
  );
}
