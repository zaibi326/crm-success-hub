
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CustomField } from './AppBuilderContent';
import { GripVertical } from 'lucide-react';

interface SortableFieldItemProps {
  field: CustomField;
  isDragging?: boolean;
}

export function SortableFieldItem({ field, isDragging = false }: SortableFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getFieldIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      text: '📝',
      textarea: '📄',
      number: '🔢',
      date: '📅',
      datetime: '🕐',
      select: '📋',
      multiselect: '☑️',
      checkbox: '✅',
      file: '📎',
      calculation: '🧮',
      reference: '🔗',
    };
    return iconMap[type] || '📝';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-4 shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        <div className="text-lg">{getFieldIcon(field.type)}</div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900">{field.label}</h4>
            {field.isRequired && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </div>
          <p className="text-sm text-gray-500 capitalize">
            {field.type} • {field.name}
          </p>
        </div>
      </div>
    </div>
  );
}
