
import React from 'react';
import { FileText } from 'lucide-react';

interface NotesDisplaySectionProps {
  notes: string;
}

export function NotesDisplaySection({ notes }: NotesDisplaySectionProps) {
  return (
    <div className="podio-container p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-podio-primary" />
        <h3 className="font-semibold text-podio-text">Notes</h3>
      </div>
      <div className="bg-podio-surface border border-podio-border rounded-lg p-4">
        <p className="text-sm text-podio-text leading-relaxed">{notes}</p>
      </div>
    </div>
  );
}
