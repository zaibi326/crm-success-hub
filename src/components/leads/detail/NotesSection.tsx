
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';
import { LinkifiedText } from '@/components/common/LinkifiedText';

interface NoteEntry {
  id: string;
  text: string;
  timestamp: Date;
  userName: string;
}

interface NotesSectionProps {
  notes: NoteEntry[];
  newNote: string;
  onNewNoteChange: (note: string) => void;
  onAddNote: () => void;
  canEdit: boolean;
}

export function NotesSection({ 
  notes, 
  newNote, 
  onNewNoteChange, 
  onAddNote, 
  canEdit 
}: NotesSectionProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-crm-primary" />
          Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {canEdit && (
          <div className="flex gap-2">
            <Input
              value={newNote}
              onChange={(e) => onNewNoteChange(e.target.value)}
              placeholder="Add a note..."
              onKeyPress={(e) => e.key === 'Enter' && onAddNote()}
            />
            <Button onClick={onAddNote} disabled={!newNote.trim()}>
              Add
            </Button>
          </div>
        )}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-gray-50 rounded-lg border">
              <LinkifiedText text={note.text} />
              <div className="mt-2 text-xs text-gray-500">
                {note.userName} • {note.timestamp.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
