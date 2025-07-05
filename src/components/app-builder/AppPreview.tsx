
import React, { useState } from 'react';
import { CustomApp, CustomField } from './AppBuilderContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Save } from 'lucide-react';

interface AppPreviewProps {
  app: CustomApp;
}

export function AppPreview({ app }: AppPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const renderField = (field: CustomField) => {
    const fieldId = `field-${field.id}`;
    
    switch (field.type) {
      case 'text':
        return (
          <Input
            id={fieldId}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.isRequired}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.isRequired}
            rows={3}
          />
        );

      case 'number':
        return (
          <Input
            id={fieldId}
            type="number"
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, parseFloat(e.target.value) || '')}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.isRequired}
          />
        );

      case 'date':
        return (
          <Input
            id={fieldId}
            type="date"
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.isRequired}
          />
        );

      case 'datetime':
        return (
          <Input
            id={fieldId}
            type="datetime-local"
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.isRequired}
          />
        );

      case 'select':
        return (
          <Select 
            value={formData[field.name] || ''} 
            onValueChange={(value) => handleFieldChange(field.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              checked={formData[field.name] || false}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
            />
            <Label htmlFor={fieldId} className="text-sm font-normal">
              {field.label}
            </Label>
          </div>
        );

      case 'file':
        return (
          <Input
            id={fieldId}
            type="file"
            onChange={(e) => handleFieldChange(field.name, e.target.files?.[0])}
            required={field.isRequired}
          />
        );

      case 'calculation':
        return (
          <Input
            id={fieldId}
            value="[Calculated Value]"
            disabled
            className="bg-gray-100"
          />
        );

      default:
        return (
          <Input
            id={fieldId}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.isRequired}
          />
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // TODO: Handle form submission
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Eye className="w-5 h-5 text-blue-600" />
        <h2 className="text-2xl font-bold">Preview: {app.name}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{app.name}</CardTitle>
          {app.description && (
            <p className="text-gray-600">{app.description}</p>
          )}
        </CardHeader>
        
        <CardContent>
          {app.fields.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No fields added yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Add fields in the Design tab to see the form preview
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {app.fields
                .sort((a, b) => a.position - b.position)
                .map((field) => (
                  <div key={field.id}>
                    {field.type !== 'checkbox' && (
                      <Label htmlFor={`field-${field.id}`} className="mb-2 block">
                        {field.label}
                        {field.isRequired && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </Label>
                    )}
                    {renderField(field)}
                  </div>
                ))}

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Record
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
