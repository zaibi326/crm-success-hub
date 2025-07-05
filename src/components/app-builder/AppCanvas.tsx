
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FieldPalette } from './FieldPalette';
import { SortableFieldItem } from './SortableFieldItem';
import { FieldConfigPanel } from './FieldConfigPanel';
import { CustomApp, CustomField } from './AppBuilderContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Trash2 } from 'lucide-react';

interface AppCanvasProps {
  app: CustomApp;
  onAppUpdate: (app: CustomApp) => void;
}

export function AppCanvas({ app, onAppUpdate }: AppCanvasProps) {
  const [activeField, setActiveField] = useState<CustomField | null>(null);
  const [selectedField, setSelectedField] = useState<CustomField | null>(null);
  const [showFieldConfig, setShowFieldConfig] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveField(active.data.current?.field || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    // Adding new field from palette
    if (active.id.toString().startsWith('palette-')) {
      const fieldType = active.id.toString().replace('palette-', '') as CustomField['type'];
      const newField: CustomField = {
        id: Date.now().toString(),
        name: `field_${app.fields.length + 1}`,
        label: `New ${fieldType} Field`,
        type: fieldType,
        isRequired: false,
        position: app.fields.length,
      };

      onAppUpdate({
        ...app,
        fields: [...app.fields, newField]
      });
    }
    // Reordering existing fields
    else if (over.id === 'canvas' || over.id.toString().startsWith('field-')) {
      const oldIndex = app.fields.findIndex(f => f.id === active.id);
      const newIndex = app.fields.findIndex(f => f.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newFields = arrayMove(app.fields, oldIndex, newIndex);
        onAppUpdate({
          ...app,
          fields: newFields.map((field, index) => ({ ...field, position: index }))
        });
      }
    }

    setActiveField(null);
  };

  const handleFieldUpdate = (updatedField: CustomField) => {
    const updatedFields = app.fields.map(field =>
      field.id === updatedField.id ? updatedField : field
    );
    onAppUpdate({ ...app, fields: updatedFields });
    setSelectedField(updatedField);
  };

  const handleFieldDelete = (fieldId: string) => {
    const updatedFields = app.fields.filter(field => field.id !== fieldId);
    onAppUpdate({ ...app, fields: updatedFields });
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
      setShowFieldConfig(false);
    }
  };

  const handleFieldSelect = (field: CustomField) => {
    setSelectedField(field);
    setShowFieldConfig(true);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 h-full">
        <div className="w-64 flex-shrink-0">
          <FieldPalette />
        </div>

        <div className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                App Structure
                <div className="text-sm text-gray-500">
                  {app.fields.length} fields
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                id="canvas"
                className="min-h-96 bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200"
              >
                {app.fields.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    Drag fields from the palette to start building your app
                  </div>
                ) : (
                  <SortableContext items={app.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {app.fields.map((field) => (
                        <div key={field.id} className="relative group">
                          <SortableFieldItem field={field} />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => handleFieldSelect(field)}
                            >
                              <Settings className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              onClick={() => handleFieldDelete(field.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {showFieldConfig && selectedField && (
          <div className="w-80 flex-shrink-0">
            <FieldConfigPanel
              field={selectedField}
              onFieldUpdate={handleFieldUpdate}
              onClose={() => setShowFieldConfig(false)}
            />
          </div>
        )}
      </div>

      <DragOverlay>
        {activeField ? <SortableFieldItem field={activeField} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
