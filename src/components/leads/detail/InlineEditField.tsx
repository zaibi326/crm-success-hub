
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Edit3 } from 'lucide-react';

interface InlineEditFieldProps {
  label: string;
  value: string | number | undefined;
  onSave: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  className?: string;
  required?: boolean;
}

export function InlineEditField({
  label,
  value,
  onSave,
  type = 'text',
  placeholder,
  options,
  className = '',
  required = false
}: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value || ''));
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type !== 'textarea') {
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [isEditing, type]);

  const handleSave = () => {
    if (editValue !== String(value || '')) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(String(value || ''));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const displayValue = value || placeholder || 'Click to add...';
  const isEmpty = !value;

  if (type === 'select' && options) {
    if (isEditing) {
      return (
        <div className={`space-y-2 ${className}`}>
          <Label className="text-sm font-medium text-gray-700">{label}</Label>
          <Select
            value={editValue}
            onValueChange={(newValue) => {
              setEditValue(newValue);
              onSave(newValue);
              setIsEditing(false);
            }}
            onOpenChange={(open) => {
              if (!open) {
                setIsEditing(false);
              }
            }}
          >
            <SelectTrigger className="w-full border-blue-500 focus:border-blue-500 focus:ring-blue-500">
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
        </div>
      );
    }

    return (
      <div className={`space-y-2 ${className}`}>
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <div
          onClick={() => setIsEditing(true)}
          className={`
            p-3 border border-gray-200 rounded-md cursor-pointer transition-colors
            hover:border-blue-300 hover:bg-blue-50/50 group
            ${isEmpty ? 'text-gray-500 italic' : 'text-gray-900'}
          `}
        >
          <div className="flex items-center justify-between">
            <span>{options.find(opt => opt.value === value)?.label || displayValue}</span>
            <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    const InputComponent = type === 'textarea' ? Textarea : Input;
    
    return (
      <div className={`space-y-2 ${className}`}>
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <InputComponent
          ref={inputRef as any}
          type={type === 'textarea' ? undefined : type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="border-blue-500 focus:border-blue-500 focus:ring-blue-500"
          rows={type === 'textarea' ? 3 : undefined}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div
        onClick={() => setIsEditing(true)}
        className={`
          p-3 border border-gray-200 rounded-md cursor-pointer transition-colors
          hover:border-blue-300 hover:bg-blue-50/50 group min-h-[44px] flex items-center
          ${isEmpty ? 'text-gray-500 italic' : 'text-gray-900'}
        `}
      >
        <div className="flex items-center justify-between w-full">
          <span className={type === 'textarea' ? 'whitespace-pre-wrap' : ''}>
            {displayValue}
          </span>
          <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
        </div>
      </div>
    </div>
  );
}
