
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Trash2 } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities';
}

interface SidebarProps {
  currentStatus: string;
  files: UploadedFile[];
  canEdit: boolean;
  onStatusChange: (status: string) => void;
  onRemoveFile: (fileId: string) => void;
  onFileUpload: (files: File[], category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities') => void;
}

export function Sidebar({ 
  currentStatus, 
  files, 
  canEdit, 
  onStatusChange, 
  onRemoveFile, 
  onFileUpload 
}: SidebarProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!canEdit) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      onFileUpload(droppedFiles, 'other');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return;
    
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      onFileUpload(selectedFiles, 'other');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      probate: 'bg-purple-100 text-purple-800 border-purple-200',
      vesting_deed: 'bg-blue-100 text-blue-800 border-blue-200',
      death: 'bg-red-100 text-red-800 border-red-200',
      lawsuit: 'bg-orange-100 text-orange-800 border-orange-200',
      taxing_entities: 'bg-green-100 text-green-800 border-green-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="space-y-4">
      {/* Lead Documents Section */}
      <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4 text-white" />
            </div>
            Lead Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Upload Area */}
          {canEdit && (
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-gray-500 mb-4">
                PDF, DOC, JPG, PNG up to 10MB
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="hidden"
                id="file-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="bg-white border-gray-200 hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
          )}

          {/* Files List */}
          {files.length > 0 && (
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Uploaded Files ({files.length})
              </h4>
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getCategoryBadgeColor(file.category)}`}
                          >
                            {file.category.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveFile(file.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!canEdit && files.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No documents uploaded</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
