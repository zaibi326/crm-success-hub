
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotesSectionProps {
  notes: string;
  onInputChange: (field: string, value: string) => void;
}

export function NotesSection({ notes, onInputChange }: NotesSectionProps) {
  return (
    <div className="flex gap-4">
      <Label htmlFor="notes" className="w-24 text-right font-medium mt-2">
        Notes
      </Label>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => onInputChange('notes', e.target.value)}
        placeholder="Add any additional notes about this lead..."
        rows={4}
        className="flex-1"
      />
    </div>
  );
}
