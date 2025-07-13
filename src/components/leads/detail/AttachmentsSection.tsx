
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  canEdit: boolean;
}

export function AttachmentsSection({ files, onRemoveFile, canEdit }: AttachmentsSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-lg">Attachments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {files.length === 0 ? (
            <p className="text-gray-500 text-sm">No files uploaded</p>
          ) : (
            files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                <span className="text-sm truncate flex-1">{file.name}</span>
                {canEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveFile(file.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
