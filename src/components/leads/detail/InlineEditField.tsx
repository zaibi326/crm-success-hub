
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Check, X, Edit3 } from 'lucide-react';

interface InlineEditFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'number' | 'select';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  canEdit?: boolean;
  className?: string;
}

export function InlineEditField({
  label,
  value,
  onSave,
  type = 'text',
  options = [],
  placeholder,
  required = false,
  multiline = false,
  canEdit = true,
  className = ''
}: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDoubleClick = () => {
    if (canEdit && !isEditing) {
      setIsEditing(true);
    }
  };

  const getDisplayValue = () => {
    if (type === 'select' && options.length > 0) {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="group relative">
        {isEditing ? (
          <div className="flex items-center gap-2">
            {type === 'select' ? (
              <Select value={editValue} onValueChange={setEditValue}>
                <SelectTrigger className="flex-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder={placeholder} />
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
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 min-h-[80px] resize-none border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            ) : (
              <Input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type={type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
            )}
            
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                size="sm"
                onClick={handleSave}
                className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 text-white"
                title="Save changes"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50 text-gray-700"
                title="Cancel changes"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div 
            onDoubleClick={handleDoubleClick}
            className={`
              p-3 rounded-lg border bg-gray-50 min-h-[44px] flex items-center justify-between
              ${canEdit ? 'cursor-pointer hover:bg-gray-100 hover:border-blue-300 transition-colors' : 'cursor-default'}
              ${!value ? 'text-gray-400 italic' : 'text-gray-900'}
            `}
            title={canEdit ? "Double-click to edit" : "Read only"}
          >
            <span className="flex-1">
              {getDisplayValue() || placeholder || `Enter ${label.toLowerCase()}`}
            </span>
            {canEdit && (
              <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
