
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { UploadedFile } from './types';
import { getFileIcon, getFileFormat, getCategoryColor, getCategoryLabel } from './fileUtils';

interface FileItemProps {
  file: UploadedFile;
  onRemoveFile: (fileId: string) => void;
  canEdit: boolean;
}

export function FileItem({ file, onRemoveFile, canEdit }: FileItemProps) {
  const IconComponent = getFileIcon(file.type, file.name);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <IconComponent className="w-5 h-5 text-blue-500" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`text-xs ${getCategoryColor(file.category)}`}>
              {getCategoryLabel(file.category)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {getFileFormat(file.type, file.name)}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => window.open(file.url, '_blank')}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          View
        </Button>
        {canEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemoveFile(file.id)}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
