
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Paperclip, Upload } from 'lucide-react';
import { AttachmentsSectionProps } from './attachments/types';
import { PdfLinkInput } from './attachments/PdfLinkInput';
import { FilesList } from './attachments/FilesList';
import { UploadInstructions } from './attachments/UploadInstructions';

export function AttachmentsSection({ 
  files = [], // Default to empty array to prevent undefined errors
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

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-purple-600" />
            Attachments ({files?.length || 0})
          </div>
          {canEdit && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>
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
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.gif,.bmp,.webp"
        />

        <PdfLinkInput onFileUpload={onFileUpload} canEdit={canEdit} />

        <FilesList files={files} onRemoveFile={onRemoveFile} canEdit={canEdit} />

        <UploadInstructions canEdit={canEdit} />
      </CardContent>
    </Card>
  );
}
