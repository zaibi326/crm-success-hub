
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Edit, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
  multiline?: boolean;
  type?: 'text' | 'email' | 'tel' | 'select';
  options?: Array<{ value: string; label: string }>;
  className?: string;
}

export function EditableField({ 
  label, 
  value, 
  onSave, 
  multiline = false, 
  type = 'text',
  options = [],
  className = ""
}: EditableFieldProps) {
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

  // Inline editing mode for when no label is provided
  if (!label) {
    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          {type === 'select' ? (
            <Select value={editValue} onValueChange={setEditValue}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : multiline ? (
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
      );
    }

    return (
      <div className="flex items-center gap-2 group">
        <span className={cn("flex-1 cursor-pointer", className)} onClick={() => setIsEditing(true)}>
          {value || 'Click to edit'}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  // Original form field mode
  if (isEditing) {
    return (
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="font-medium text-gray-700">{label}</div>
        <div className="col-span-2 flex items-center gap-2">
          {type === 'select' ? (
            <Select value={editValue} onValueChange={setEditValue}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : multiline ? (
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
