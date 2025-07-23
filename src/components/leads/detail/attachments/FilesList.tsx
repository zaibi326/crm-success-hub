import React from 'react';
import { Paperclip } from 'lucide-react';
import { UploadedFile } from './types';
import { FileItem } from './FileItem';
interface FilesListProps {
  files: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
  canEdit: boolean;
}
export function FilesList({
  files,
  onRemoveFile,
  canEdit
}: FilesListProps) {
  if (!files || files.length === 0) {
    return;
  }
  return <div className="space-y-3">
      {files.map(file => <FileItem key={file.id} file={file} onRemoveFile={onRemoveFile} canEdit={canEdit} />)}
    </div>;
}