
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PdfLinkInputProps {
  onFileUpload?: (files: File[], category: 'probate' | 'vesting_deed' | 'other' | 'death' | 'lawsuit' | 'taxing_entities') => void;
  canEdit: boolean;
}

export function PdfLinkInput({ onFileUpload, canEdit }: PdfLinkInputProps) {
  const pdfLinkInputRef = useRef<HTMLInputElement>(null);

  const handleAddPdfLink = () => {
    const linkInput = pdfLinkInputRef.current;
    if (linkInput && linkInput.value.trim()) {
      // Create a mock file object for the PDF link
      const mockFile = {
        name: 'PDF Link',
        type: 'application/pdf',
        size: 0,
        lastModified: Date.now(),
        webkitRelativePath: linkInput.value,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        slice: () => new Blob(),
        stream: () => new ReadableStream(),
        text: () => Promise.resolve('')
      } as File;
      
      if (onFileUpload) {
        onFileUpload([mockFile], 'other');
      }
      linkInput.value = '';
    }
  };

  if (!canEdit) return null;

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <Label htmlFor="pdf-link" className="text-sm font-medium text-gray-700 mb-2 block">
        Add PDF Link
      </Label>
      <div className="flex gap-2">
        <Input
          ref={pdfLinkInputRef}
          type="url"
          placeholder="https://example.com/document.pdf"
          className="flex-1"
        />
        <Button
          size="sm"
          onClick={handleAddPdfLink}
          variant="outline"
        >
          Add Link
        </Button>
      </div>
    </div>
  );
}
