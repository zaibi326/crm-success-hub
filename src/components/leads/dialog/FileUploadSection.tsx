
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadSectionProps {
  attachedFiles: File[];
  onFilesChange: (files: File[]) => void;
}

export function FileUploadSection({ attachedFiles, onFilesChange }: FileUploadSectionProps) {
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onFilesChange([...attachedFiles, ...files]);
    toast({
      title: "Files attached",
      description: `${files.length} file(s) attached successfully`,
    });
  };

  const removeFile = (index: number) => {
    onFilesChange(attachedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="flex gap-4">
      <Label className="w-24 text-right font-medium mt-2">
        Attach Files
      </Label>
      <div className="flex-1">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-600">Click to upload files</span>
            <span className="text-xs text-gray-400">PDF, DOC, JPG, PNG supported</span>
          </label>
        </div>
        
        {attachedFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {attachedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                <span className="text-sm text-gray-700">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
