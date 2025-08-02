
import React from 'react';

interface NotesDisplaySectionProps {
  notes: string;
}

export function NotesDisplaySection({ notes }: NotesDisplaySectionProps) {
  return (
    <div className="p-3 bg-gray-50 rounded-md border-l-4 border-blue-500">
      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
        {notes}
      </p>
    </div>
  );
}
