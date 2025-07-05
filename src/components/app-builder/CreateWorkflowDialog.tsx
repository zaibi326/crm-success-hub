
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomApp, Workflow, WorkflowAction } from './AppBuilderContent';

interface CreateWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateWorkflow: (workflow: Omit<Workflow, 'id'>) => void;
  app: CustomApp;
}

export function CreateWorkflowDialog({ 
  open, 
  onOpenChange, 
  onCreateWorkflow, 
  app 
}: CreateWorkflowDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerType: '' as Workflow['triggerType'] | '',
    actions: [] as WorkflowAction[]
  });

  const [selectedAction, setSelectedAction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.triggerType) return;

    onCreateWorkflow({
      ...formData,
      triggerType: formData.triggerType as Workflow['triggerType'],
      triggerConditions: {},
      isActive: true
    });

    setFormData({
      name: '',
      description: '',
      triggerType: '',
      actions: []
    });
  };

  const addAction = () => {
    if (!selectedAction) return;

    const newAction: WorkflowAction = {
      id: Date.now().toString(),
      type: selectedAction as WorkflowAction['type'],
      config: {}
    };

    setFormData({
      ...formData,
      actions: [...formData.actions, newAction]
    });
    setSelectedAction('');
  };

  const removeAction = (actionId: string) => {
    setFormData({
      ...formData,
      actions: formData.actions.filter(action => action.id !== actionId)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Workflow Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter workflow name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what this workflow does"
              rows={2}
            />
          </div>

          <div>
            <Label>Trigger Type</Label>
            <Select 
              value={formData.triggerType} 
              onValueChange={(value) => setFormData({...formData, triggerType: value as Workflow['triggerType']})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trigger type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create">When record is created</SelectItem>
                <SelectItem value="update">When record is updated</SelectItem>
                <SelectItem value="delete">When record is deleted</SelectItem>
                <SelectItem value="field_change">When field changes</SelectItem>
                <SelectItem value="scheduled">On schedule</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Actions</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Send Email</SelectItem>
                    <SelectItem value="webhook">Send Webhook</SelectItem>
                    <SelectItem value="update_field">Update Field</SelectItem>
                    <SelectItem value="create_record">Create Record</SelectItem>
                    <SelectItem value="notification">Send Notification</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addAction} disabled={!selectedAction}>
                  Add
                </Button>
              </div>

              {formData.actions.map((action) => (
                <div key={action.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">
                    {action.type === 'email' && '📧 Send email notification'}
                    {action.type === 'webhook' && '🌐 Send webhook'}
                    {action.type === 'update_field' && '✏️ Update field value'}
                    {action.type === 'create_record' && '➕ Create new record'}
                    {action.type === 'notification' && '🔔 Send in-app notification'}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAction(action.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Workflow</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
