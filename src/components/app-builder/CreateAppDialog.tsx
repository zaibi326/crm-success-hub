
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CustomApp } from './AppBuilderContent';

interface CreateAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateApp: (app: Omit<CustomApp, 'id'>) => void;
}

export function CreateAppDialog({ open, onOpenChange, onCreateApp }: CreateAppDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'app-window',
    color: '#3B82F6'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onCreateApp({
      ...formData,
      fields: [],
      workflows: []
    });

    setFormData({
      name: '',
      description: '',
      icon: 'app-window',
      color: '#3B82F6'
    });
  };

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New App</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">App Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter app name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what this app does"
              rows={3}
            />
          </div>

          <div>
            <Label>App Color</Label>
            <div className="flex gap-2 mt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({...formData, color})}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create App</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
