
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText, Image, File } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities';
}

interface FileUploadSectionProps {
  title: string;
  category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities';
  files: UploadedFile[];
  onFileUpload: (files: File[]) => void;
  onRemoveFile: (fileId: string) => void;
  acceptedTypes?: string;
  disabled?: boolean;
}

export function FileUploadSection({
  title,
  category,
  files,
  onFileUpload,
  onRemoveFile,
  acceptedTypes = ".pdf,.docx,.png,.jpg,.jpeg",
  disabled = false
}: FileUploadSectionProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      onFileUpload(selectedFiles);
    }
    // Reset input to allow uploading the same file again
    event.target.value = '';
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (type.includes('image')) return <Image className="w-8 h-8 text-blue-500" />;
    if (type.includes('document') || type.includes('word')) return <File className="w-8 h-8 text-blue-600" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const getFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Upload className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div className="text-center">
          <input
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${category}`}
            disabled={disabled}
          />
          <label
            htmlFor={`file-upload-${category}`}
            className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {files.length > 0 ? 'Upload more documents' : 'Click to upload documents'}
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: PDF, DOCX, PNG, JPG (max 10MB each)
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Uploaded Files:</Label>
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.type.split('/')[1]?.toUpperCase() || 'Document'}
                    </p>
                  </div>
                  {!disabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
