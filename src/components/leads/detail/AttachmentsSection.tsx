
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Paperclip, 
  Upload, 
  File, 
  Image, 
  FileText,
  Download,
  Eye,
  Plus,
  FolderOpen
} from 'lucide-react';
import { AttachmentsSectionProps } from './attachments/types';
import { PdfLinkInput } from './attachments/PdfLinkInput';
import { FilesList } from './attachments/FilesList';
import { UploadInstructions } from './attachments/UploadInstructions';

export function AttachmentsSection({ 
  files = [], 
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

  const getFileTypeStats = () => {
    const stats = {
      total: files.length,
      documents: files.filter(f => f.type.includes('pdf') || f.type.includes('doc')).length,
      images: files.filter(f => f.type.includes('image')).length,
      other: files.filter(f => !f.type.includes('pdf') && !f.type.includes('doc') && !f.type.includes('image')).length
    };
    return stats;
  };

  const stats = getFileTypeStats();

  return (
    <Card className="shadow-md border bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-purple-600" />
            <span className="text-gray-900 font-medium">Attachments</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {stats.total} files
            </Badge>
            {canEdit && (
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 hover:bg-purple-700 text-white h-7 px-2 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.gif,.bmp,.webp"
        />

        {/* File Statistics - Compact */}
        {stats.total > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-blue-50 rounded p-2 text-center border">
              <FileText className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-blue-900">{stats.documents}</div>
              <div className="text-xs text-blue-700">Docs</div>
            </div>
            <div className="bg-green-50 rounded p-2 text-center border">
              <Image className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-green-900">{stats.images}</div>
              <div className="text-xs text-green-700">Images</div>
            </div>
            <div className="bg-orange-50 rounded p-2 text-center border">
              <File className="w-4 h-4 text-orange-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-orange-900">{stats.other}</div>
              <div className="text-xs text-orange-700">Other</div>
            </div>
          </div>
        )}

        {/* PDF Link Input - Compact */}
        <div className="mb-4">
          <PdfLinkInput onFileUpload={onFileUpload} canEdit={canEdit} />
        </div>

        {/* Files List */}
        <div className="mb-4">
          {files.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded border-2 border-dashed border-gray-300">
              <FolderOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h4 className="text-sm font-medium text-gray-900 mb-1">No files attached</h4>
              <p className="text-xs text-gray-500 mb-3">
                Upload documents or add PDF links
              </p>
              {canEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 px-3 text-xs"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Upload Files
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Files ({files.length})</h4>
                {files.length > 1 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs"
                    onClick={() => console.log('Download all files')}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    All
                  </Button>
                )}
              </div>
              <FilesList files={files} onRemoveFile={onRemoveFile} canEdit={canEdit} />
            </div>
          )}
        </div>

        {/* Upload Instructions - Compact */}
        <UploadInstructions canEdit={canEdit} />

        {/* Quick Actions - Compact */}
        {canEdit && files.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-7 px-2 text-xs flex-1"
              >
                <Upload className="w-3 h-3 mr-1" />
                Upload More
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => console.log('Scan document')}
              >
                <Eye className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
