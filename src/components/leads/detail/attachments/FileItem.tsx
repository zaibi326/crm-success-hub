
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Eye, Download } from 'lucide-react';
import { UploadedFile } from './types';
import { getFileIcon, getFileFormat, getCategoryColor, getCategoryLabel } from './fileUtils';

interface FileItemProps {
  file: UploadedFile;
  onRemoveFile: (fileId: string) => void;
  canEdit: boolean;
}

export function FileItem({ file, onRemoveFile, canEdit }: FileItemProps) {
  const IconComponent = getFileIcon(file.type, file.name);
  
  // Format upload date (assuming file was uploaded recently for demo)
  const uploadDate = new Date().toLocaleDateString();
  
  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes || bytes === 0) return '';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handlePreview = () => {
    window.open(file.url, '_blank');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-all group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <IconComponent className="w-6 h-6 text-blue-500 flex-shrink-0" />
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
            {file.size && (
              <span className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Uploaded: {uploadDate}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={handlePreview}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          title="Preview/View"
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDownload}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </Button>
        {canEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemoveFile(file.id)}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
