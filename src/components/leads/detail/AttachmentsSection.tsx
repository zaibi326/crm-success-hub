
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Paperclip, Upload, X, FileIcon, Image } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  category: 'probate' | 'vesting_deed' | 'other';
}

interface AttachmentsSectionProps {
  files: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
  onFileUpload?: (files: File[], category: 'probate' | 'vesting_deed' | 'other') => void;
  canEdit: boolean;
}

export function AttachmentsSection({ 
  files, 
  onRemoveFile, 
  onFileUpload,
  canEdit 
}: AttachmentsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0 && onFileUpload) {
      onFileUpload(selectedFiles, 'other');
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="w-4 h-4 text-blue-500" />;
    }
    return <FileIcon className="w-4 h-4 text-gray-500" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'probate':
        return 'bg-purple-100 text-purple-800';
      case 'vesting_deed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'probate':
        return 'Probate';
      case 'vesting_deed':
        return 'Vesting Deed';
      default:
        return 'Other';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-purple-600" />
            Attachments ({files.length})
          </div>
          {canEdit && (
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />

        {/* Files List */}
        <div className="space-y-3">
          {files.length === 0 ? (
            <div className="text-center py-8">
              <Paperclip className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No files attached</p>
              {canEdit && (
                <p className="text-gray-400 text-xs mt-1">
                  Click the Upload button to add files
                </p>
              )}
            </div>
          ) : (
            files.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${getCategoryColor(file.category)}`}>
                        {getCategoryLabel(file.category)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {file.type.split('/')[1]?.toUpperCase()}
                      </span>
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
            ))
          )}
        </div>

        {/* Upload Instructions */}
        {canEdit && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-xs">
              Supported formats: PDF, JPG, PNG, DOC, DOCX • Maximum file size: 10MB
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
