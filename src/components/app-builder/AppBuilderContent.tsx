
import React, { useState } from 'react';
import { AppBuilderSidebar } from './AppBuilderSidebar';
import { AppCanvas } from './AppCanvas';
import { AppPreview } from './AppPreview';
import { WorkflowBuilder } from './WorkflowBuilder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Save, Play, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface CustomApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  fields: CustomField[];
  workflows: Workflow[];
}

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'datetime' | 'select' | 'multiselect' | 'checkbox' | 'file' | 'calculation' | 'reference';
  isRequired: boolean;
  options?: string[];
  validationRules?: Record<string, any>;
  position: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  triggerType: 'create' | 'update' | 'delete' | 'field_change' | 'scheduled';
  triggerConditions: Record<string, any>;
  actions: WorkflowAction[];
  isActive: boolean;
}

export interface WorkflowAction {
  id: string;
  type: 'email' | 'webhook' | 'update_field' | 'create_record' | 'notification';
  config: Record<string, any>;
}

export function AppBuilderContent() {
  const [currentApp, setCurrentApp] = useState<CustomApp | null>(null);
  const [activeTab, setActiveTab] = useState('design');
  const { toast } = useToast();

  const handleSaveApp = () => {
    if (!currentApp) return;
    
    // TODO: Implement save to Supabase
    toast({
      title: "App Saved",
      description: "Your custom app has been saved successfully.",
    });
  };

  const handlePreviewApp = () => {
    setActiveTab('preview');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AppBuilderSidebar 
        currentApp={currentApp}
        onAppSelect={setCurrentApp}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">
              {currentApp ? currentApp.name : 'Custom App Builder'}
            </h1>
            {currentApp && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveApp}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handlePreviewApp}>
                  <Play className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            )}
          </div>
        </div>

        {currentApp ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mx-6 mt-4 w-fit">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="flex-1 p-6">
              <AppCanvas 
                app={currentApp}
                onAppUpdate={setCurrentApp}
              />
            </TabsContent>

            <TabsContent value="workflows" className="flex-1 p-6">
              <WorkflowBuilder 
                app={currentApp}
                onAppUpdate={setCurrentApp}
              />
            </TabsContent>

            <TabsContent value="preview" className="flex-1 p-6">
              <AppPreview app={currentApp} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to App Builder
              </h2>
              <p className="text-gray-600 mb-4">
                Create custom applications with drag-and-drop interface
              </p>
              <p className="text-sm text-gray-500">
                Select an app from the sidebar or create a new one to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
