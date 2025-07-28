
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Edit2, Check, X } from 'lucide-react';

interface InlineEditFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void> | void;
  type?: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea';
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  canEdit?: boolean;
}

export function InlineEditField({ 
  label, 
  value, 
  onSave, 
  type = 'text',
  options = [],
  required = false,
  canEdit = true
}: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (required && !editValue.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving field:', error);
      // Reset to original value on error
      setEditValue(value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  // Update edit value when prop value changes
  React.useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  const renderEditField = () => {
    switch (type) {
      case 'select':
        return (
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
        );
      case 'textarea':
        return (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1"
            rows={3}
            required={required}
          />
        );
      default:
        return (
          <Input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1"
            required={required}
          />
        );
    }
  };

  if (isEditing && canEdit) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {renderEditField()}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || (required && !editValue.trim())}
            className="h-8 px-3 bg-green-600 hover:bg-green-700"
          >
            {isSaving ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-3 h-3" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="h-8 px-3"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-2 group">
        <div className="flex-1 min-h-[40px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
          <span className="text-gray-900">
            {type === 'select' && options.length > 0 
              ? options.find(opt => opt.value === value)?.label || value || 'Not set'
              : value || 'Not set'
            }
          </span>
        </div>
        {canEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
