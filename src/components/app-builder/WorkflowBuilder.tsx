
import React, { useState } from 'react';
import { CustomApp, Workflow, WorkflowAction } from './AppBuilderContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Play, Pause, Settings } from 'lucide-react';
import { CreateWorkflowDialog } from './CreateWorkflowDialog';

interface WorkflowBuilderProps {
  app: CustomApp;
  onAppUpdate: (app: CustomApp) => void;
}

export function WorkflowBuilder({ app, onAppUpdate }: WorkflowBuilderProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  const handleCreateWorkflow = (workflow: Omit<Workflow, 'id'>) => {
    const newWorkflow: Workflow = {
      ...workflow,
      id: Date.now().toString()
    };
    
    onAppUpdate({
      ...app,
      workflows: [...app.workflows, newWorkflow]
    });
    setShowCreateDialog(false);
  };

  const handleToggleWorkflow = (workflowId: string) => {
    const updatedWorkflows = app.workflows.map(workflow =>
      workflow.id === workflowId
        ? { ...workflow, isActive: !workflow.isActive }
        : workflow
    );
    onAppUpdate({ ...app, workflows: updatedWorkflows });
  };

  const getTriggerDescription = (workflow: Workflow) => {
    switch (workflow.triggerType) {
      case 'create': return 'When a new record is created';
      case 'update': return 'When a record is updated';
      case 'delete': return 'When a record is deleted';
      case 'field_change': return 'When a specific field changes';
      case 'scheduled': return 'On a schedule';
      default: return 'Unknown trigger';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workflow Automation</h2>
          <p className="text-gray-600">Define triggers and actions for your app</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {app.workflows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-gray-400 mb-4">
              <Settings className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No workflows yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create workflows to automate tasks when certain events occur
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Workflow
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {app.workflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {workflow.name}
                      {workflow.isActive ? (
                        <Play className="w-4 h-4 text-green-500" />
                      ) : (
                        <Pause className="w-4 h-4 text-gray-400" />
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {workflow.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleWorkflow(workflow.id)}
                    >
                      {workflow.isActive ? 'Pause' : 'Activate'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">Trigger</h4>
                    <p className="text-sm text-gray-600">
                      {getTriggerDescription(workflow)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">Actions</h4>
                    <div className="space-y-1">
                      {workflow.actions.map((action, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {action.type === 'email' && '📧 Send email notification'}
                          {action.type === 'webhook' && '🌐 Send webhook'}
                          {action.type === 'update_field' && '✏️ Update field value'}
                          {action.type === 'create_record' && '➕ Create new record'}
                          {action.type === 'notification' && '🔔 Send in-app notification'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateWorkflowDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateWorkflow={handleCreateWorkflow}
        app={app}
      />
    </div>
  );
}
