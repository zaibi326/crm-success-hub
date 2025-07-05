
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Type, 
  AlignLeft, 
  Hash, 
  Calendar, 
  Clock, 
  List, 
  CheckSquare, 
  Upload, 
  Calculator, 
  Link 
} from 'lucide-react';

const fieldTypes = [
  { type: 'text', label: 'Text', icon: Type, description: 'Single line text input' },
  { type: 'textarea', label: 'Textarea', icon: AlignLeft, description: 'Multi-line text input' },
  { type: 'number', label: 'Number', icon: Hash, description: 'Numeric input' },
  { type: 'date', label: 'Date', icon: Calendar, description: 'Date picker' },
  { type: 'datetime', label: 'DateTime', icon: Clock, description: 'Date and time picker' },
  { type: 'select', label: 'Select', icon: List, description: 'Dropdown selection' },
  { type: 'multiselect', label: 'Multi-Select', icon: List, description: 'Multiple selections' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Boolean checkbox' },
  { type: 'file', label: 'File Upload', icon: Upload, description: 'File upload field' },
  { type: 'calculation', label: 'Calculation', icon: Calculator, description: 'Calculated field' },
  { type: 'reference', label: 'Reference', icon: Link, description: 'Link to another record' },
];

function DraggableFieldItem({ type, label, icon: Icon, description }: { 
  type: string; 
  label: string; 
  icon: any; 
  description: string; 
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type: 'field', fieldType: type }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 border rounded-lg cursor-grab bg-white hover:bg-gray-50 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm">{label}</h4>
          <p className="text-xs text-gray-500 truncate">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function FieldPalette() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Field Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {fieldTypes.map((field) => (
          <DraggableFieldItem
            key={field.type}
            type={field.type}
            label={field.label}
            icon={field.icon}
            description={field.description}
          />
        ))}
      </CardContent>
    </Card>
  );
}
