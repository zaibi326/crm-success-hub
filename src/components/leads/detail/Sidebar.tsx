
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities';
}

interface SidebarProps {
  currentStatus: 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP';
  files: UploadedFile[];
  canEdit: boolean;
  onStatusChange: (status: 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP') => void;
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
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'text/plain': ['.txt']
    },
    onDrop: (acceptedFiles) => {
      if (canEdit) {
        onFileUpload(acceptedFiles, 'other');
      }
    },
    disabled: !canEdit
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'HOT':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'WARM':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'COLD':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PASS':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'KEEP':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">Lead Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <Badge className={`${getStatusBadgeColor(currentStatus)} px-3 py-1 text-sm font-medium border`}>
              {currentStatus}
            </Badge>
            
            {canEdit && (
              <Select value={currentStatus} onValueChange={onStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOT">Hot Lead</SelectItem>
                  <SelectItem value="WARM">Warm Lead</SelectItem>
                  <SelectItem value="COLD">Cold Lead</SelectItem>
                  <SelectItem value="PASS">Pass</SelectItem>
                  <SelectItem value="KEEP">Keep</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lead Documents Card */}
      <Card className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Lead Documents ({files.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Upload Area */}
          {canEdit && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors mb-4 ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Drop files here...' : 'Drop files or click to upload'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOC, JPG, PNG files
              </p>
            </div>
          )}

          {/* Files List */}
          {files.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFile(file.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No documents uploaded yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
