
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, X, Edit3 } from 'lucide-react';

interface InlineEditFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'number';
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

  const handleClick = () => {
    if (canEdit && !isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
        {canEdit && !isEditing && (
          <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </label>
      
      <div className="group relative">
        {isEditing ? (
          <div className="flex items-center gap-2">
            {multiline ? (
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
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                onClick={handleSave}
                className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div 
            onClick={handleClick}
            className={`
              p-3 rounded-lg border bg-gray-50 min-h-[44px] flex items-center
              ${canEdit ? 'cursor-pointer hover:bg-gray-100 hover:border-blue-300 transition-colors' : 'cursor-default'}
              ${!value ? 'text-gray-400 italic' : 'text-gray-900'}
            `}
          >
            {value || placeholder || `Enter ${label.toLowerCase()}`}
            {canEdit && (
              <Edit3 className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
