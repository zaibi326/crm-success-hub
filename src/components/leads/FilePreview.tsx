
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  preview?: string;
}

interface FilePreviewProps {
  files: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
}

export function FilePreview({ files, onRemoveFile }: FilePreviewProps) {
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('document') || type.includes('word')) return '📝';
    return '📎';
  };

  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label>Uploaded Files</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {files.map((file) => (
          <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {file.preview ? (
              <img
                src={file.preview}
                alt={file.name}
                className="w-12 h-12 object-cover rounded"
              />
            ) : (
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-xl">
                {getFileIcon(file.type)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {file.type}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFile(file.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
