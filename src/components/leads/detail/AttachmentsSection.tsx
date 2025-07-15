
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
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-t-lg">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Paperclip className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-purple-900 font-semibold">Document Attachments</h3>
              <p className="text-sm text-purple-700 font-normal mt-1">
                Manage files and documents for this lead
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white/80 text-purple-700 border-purple-200">
              {stats.total} files
            </Badge>
            {canEdit && (
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Files
              </Button>
            )}
          </div>
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
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.gif,.bmp,.webp"
        />

        {/* File Statistics */}
        {stats.total > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
              <FileText className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-blue-900">{stats.documents}</div>
              <div className="text-xs text-blue-700">Documents</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
              <Image className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-green-900">{stats.images}</div>
              <div className="text-xs text-green-700">Images</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
              <File className="w-6 h-6 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-orange-900">{stats.other}</div>
              <div className="text-xs text-orange-700">Other</div>
            </div>
          </div>
        )}

        {/* PDF Link Input */}
        <div className="mb-6">
          <PdfLinkInput onFileUpload={onFileUpload} canEdit={canEdit} />
        </div>

        {/* Files List */}
        <div className="mb-6">
          {files.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files attached</h3>
              <p className="text-gray-500 text-sm mb-4">
                Upload documents, images, or add PDF links to get started
              </p>
              {canEdit && (
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Files
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Attached Files</h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => {
                      // Download all files logic could go here
                      console.log('Download all files');
                    }}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download All
                  </Button>
                </div>
              </div>
              <FilesList files={files} onRemoveFile={onRemoveFile} canEdit={canEdit} />
            </div>
          )}
        </div>

        {/* Upload Instructions */}
        <UploadInstructions canEdit={canEdit} />

        {/* Quick Actions */}
        {canEdit && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm"
              >
                <Upload className="w-4 h-4" />
                Upload Files
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2 text-sm"
                onClick={() => {
                  // Could open a document scanner or camera
                  console.log('Scan document');
                }}
              >
                <Eye className="w-4 h-4" />
                Scan Document
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
