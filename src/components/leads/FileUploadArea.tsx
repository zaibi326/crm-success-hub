
import React from 'react';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface FileUploadAreaProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUploadArea({ onFileUpload }: FileUploadAreaProps) {
  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Document Upload
      </Label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-crm-primary transition-colors">
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={onFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">
            Click to upload files or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PDF, DOC, DOCX, JPG, PNG up to 10MB each
          </p>
        </label>
      </div>
    </div>
  );
}
