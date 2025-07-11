
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit, Check, X } from 'lucide-react';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
  multiline?: boolean;
  type?: 'text' | 'email' | 'tel';
}

export function EditableField({ label, value, onSave, multiline = false, type = 'text' }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="font-medium text-gray-700">{label}</div>
        <div className="col-span-2 flex items-center gap-2">
          {multiline ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1"
              rows={3}
            />
          ) : (
            <Input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1"
            />
          )}
          <Button
            size="sm"
            onClick={handleSave}
            className="h-8 px-2 bg-green-600 hover:bg-green-700"
          >
            <Check className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            className="h-8 px-2"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div className="font-medium text-gray-700">{label}</div>
      <div className="col-span-2 flex items-center gap-2 group">
        <span className="text-gray-900 flex-1">{value || 'Not provided'}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
