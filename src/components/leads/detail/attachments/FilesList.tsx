
import React from 'react';
import { Paperclip } from 'lucide-react';
import { UploadedFile } from './types';
import { FileItem } from './FileItem';

interface FilesListProps {
  files: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
  canEdit: boolean;
}

export function FilesList({ files, onRemoveFile, canEdit }: FilesListProps) {
  if (!files || files.length === 0) {
    return (
      <div className="text-center py-8">
        <Paperclip className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No files attached</p>
        {canEdit && (
          <p className="text-gray-400 text-xs mt-1">
            Click the Upload Files button or add a PDF link
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          onRemoveFile={onRemoveFile}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
}
