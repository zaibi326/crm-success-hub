
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  onSave: () => void;
  isSaving: boolean;
  canEdit: boolean;
  disposition: 'keep' | 'pass' | null;
}

export function SaveButton({ onSave, isSaving, canEdit, disposition }: SaveButtonProps) {
  if (!canEdit || !disposition) return null;

  return (
    <div className="sticky bottom-6 z-10 flex justify-center">
      <Button
        onClick={onSave}
        disabled={isSaving}
        className="bg-gradient-to-r from-crm-primary to-crm-accent hover:from-crm-primary/90 hover:to-crm-accent/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105"
      >
        {isSaving ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </div>
        ) : (
          <>
            <Save className="w-5 h-5 mr-2" />
            Save Lead Details
          </>
        )}
      </Button>
    </div>
  );
}
