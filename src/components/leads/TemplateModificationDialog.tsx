import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Save,
  Type,
  Phone,
  Mail,
  Link,
  Map,
  Tag,
  List,
  FileText,
  Upload
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TaxLead } from '@/types/taxLead';
import { useToast } from '@/hooks/use-toast';

interface CustomField {
  id: string;
  type: 'text' | 'phone' | 'email' | 'url' | 'map' | 'tags' | 'dropdown' | 'checkbox' | 'textarea' | 'file';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface TemplateModificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lead: TaxLead;
  onSave: (updatedLead: TaxLead) => void;
}

const fieldTypeIcons = {
  text: Type,
  phone: Phone,
  email: Mail,
  url: Link,
  map: Map,
  tags: Tag,
  dropdown: List,
  checkbox: List,
  textarea: FileText,
  file: Upload
};

export function TemplateModificationDialog({ isOpen, onClose, lead, onSave }: TemplateModificationDialogProps) {
  const [templateName, setTemplateName] = useState('Default Lead Template');
  const [customFields, setCustomFields] = useState<CustomField[]>([
    { id: '1', type: 'text', label: 'Tax ID', required: true },
    { id: '2', type: 'text', label: 'Owner Name', required: true },
    { id: '3', type: 'text', label: 'Property Address', required: true },
    { id: '4', type: 'phone', label: 'Phone Number', required: false },
    { id: '5', type: 'email', label: 'Email Address', required: false },
    { id: '6', type: 'url', label: 'Zillow Link', required: false },
    { id: '7', type: 'map', label: 'Property Map', required: false },
    { id: '8', type: 'tags', label: 'Lead Status', required: false },
    { id: '9', type: 'textarea', label: 'Notes', required: false }
  ]);
  const [newFieldType, setNewFieldType] = useState<CustomField['type']>('text');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const { toast } = useToast();

  const handleAddField = () => {
    if (!newFieldLabel.trim()) {
      toast({
        title: "Field label required",
        description: "Please enter a label for the new field",
        variant: "destructive"
      });
      return;
    }

    const newField: CustomField = {
      id: Date.now().toString(),
      type: newFieldType,
      label: newFieldLabel,
      required: false,
      placeholder: `Enter ${newFieldLabel.toLowerCase()}`
    };

    setCustomFields([...customFields, newField]);
    setNewFieldLabel('');
    setNewFieldType('text');
  };

  const handleRemoveField = (fieldId: string) => {
    setCustomFields(customFields.filter(field => field.id !== fieldId));
  };

  const handleFieldUpdate = (fieldId: string, updates: Partial<CustomField>) => {
    setCustomFields(customFields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(customFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCustomFields(items);
  };

  const handleSaveTemplate = () => {
    toast({
      title: "Template Saved",
      description: `Template "${templateName}" has been saved successfully`,
    });
    onClose();
  };

  const renderFieldPreview = (field: CustomField) => {
    const IconComponent = fieldTypeIcons[field.type];
    
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <IconComponent className="w-4 h-4 text-gray-600" />
        <div className="flex-1">
          <div className="font-medium text-sm">{field.label}</div>
          <div className="text-xs text-gray-500 capitalize">{field.type}</div>
        </div>
        {field.required && (
          <Badge variant="secondary" className="text-xs">Required</Badge>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Modify Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name</Label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Field Configuration */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Field Configuration</h3>
              
              {/* Add New Field */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Add New Field</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Field Type</Label>
                      <Select value={newFieldType} onValueChange={(value: CustomField['type']) => setNewFieldType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Single-line Text</SelectItem>
                          <SelectItem value="phone">Phone Number</SelectItem>
                          <SelectItem value="email">Email Address</SelectItem>
                          <SelectItem value="url">Website/URL</SelectItem>
                          <SelectItem value="map">Embedded Map</SelectItem>
                          <SelectItem value="tags">Tags/Chips</SelectItem>
                          <SelectItem value="dropdown">Dropdown</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                          <SelectItem value="textarea">Multi-line Text</SelectItem>
                          <SelectItem value="file">File Upload</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Field Label</Label>
                      <Input
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        placeholder="Enter field label"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddField} className="w-full" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Fields */}
              <div className="space-y-2">
                <h4 className="font-medium">Current Fields</h4>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="fields">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {customFields.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center gap-2 p-3 bg-white border rounded-lg"
                              >
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <Input
                                    value={field.label}
                                    onChange={(e) => handleFieldUpdate(field.id, { label: e.target.value })}
                                    className="font-medium"
                                  />
                                  <div className="text-xs text-gray-500 mt-1 capitalize">{field.type}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={field.required}
                                    onCheckedChange={(checked) => handleFieldUpdate(field.id, { required: !!checked })}
                                  />
                                  <Label className="text-xs">Required</Label>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveField(field.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Preview</h3>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Form Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {customFields.map((field) => renderFieldPreview(field))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveTemplate}>
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
