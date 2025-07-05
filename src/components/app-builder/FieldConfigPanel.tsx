
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { CustomField } from './AppBuilderContent';

interface FieldConfigPanelProps {
  field: CustomField;
  onFieldUpdate: (field: CustomField) => void;
  onClose: () => void;
}

export function FieldConfigPanel({ field, onFieldUpdate, onClose }: FieldConfigPanelProps) {
  const [config, setConfig] = useState(field);

  const handleSave = () => {
    onFieldUpdate(config);
  };

  const handleOptionAdd = () => {
    const options = config.options || [];
    setConfig({
      ...config,
      options: [...options, `Option ${options.length + 1}`]
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const options = [...(config.options || [])];
    options[index] = value;
    setConfig({ ...config, options });
  };

  const handleOptionRemove = (index: number) => {
    const options = [...(config.options || [])];
    options.splice(index, 1);
    setConfig({ ...config, options });
  };

  const showOptions = ['select', 'multiselect'].includes(config.type);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Field Settings</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="label">Field Label</Label>
          <Input
            id="label"
            value={config.label}
            onChange={(e) => setConfig({ ...config, label: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="name">Field Name</Label>
          <Input
            id="name"
            value={config.name}
            onChange={(e) => setConfig({ ...config, name: e.target.value })}
            placeholder="field_name"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used for data storage (no spaces, lowercase)
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="required">Required Field</Label>
          <Switch
            id="required"
            checked={config.isRequired}
            onCheckedChange={(checked) => setConfig({ ...config, isRequired: checked })}
          />
        </div>

        {showOptions && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Options</Label>
              <Button size="sm" variant="outline" onClick={handleOptionAdd}>
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {(config.options || []).map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOptionRemove(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {config.type === 'calculation' && (
          <div>
            <Label htmlFor="formula">Formula</Label>
            <Textarea
              id="formula"
              placeholder="e.g., field1 + field2 * 0.1"
              value={config.validationRules?.formula || ''}
              onChange={(e) => setConfig({
                ...config,
                validationRules: { ...config.validationRules, formula: e.target.value }
              })}
            />
          </div>
        )}

        <div className="pt-4">
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
