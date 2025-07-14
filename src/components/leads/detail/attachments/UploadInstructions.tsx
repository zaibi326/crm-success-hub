
import React from 'react';

interface UploadInstructionsProps {
  canEdit: boolean;
}

export function UploadInstructions({ canEdit }: UploadInstructionsProps) {
  if (!canEdit) return null;

  return (
    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-blue-800 text-xs">
        Supported formats: PDF, JPG, PNG, DOC, DOCX, GIF, BMP, WEBP • Maximum file size: 10MB
      </p>
    </div>
  );
}
