
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, AppWindow } from 'lucide-react';
import { CustomApp } from './AppBuilderContent';
import { CreateAppDialog } from './CreateAppDialog';

interface AppBuilderSidebarProps {
  currentApp: CustomApp | null;
  onAppSelect: (app: CustomApp) => void;
}

export function AppBuilderSidebar({ currentApp, onAppSelect }: AppBuilderSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Mock apps for demo - in real app, this would come from Supabase
  const [apps, setApps] = useState<CustomApp[]>([
    {
      id: '1',
      name: 'Task Manager',
      description: 'Manage tasks and projects',
      icon: 'check-square',
      color: '#3B82F6',
      fields: [],
      workflows: []
    },
    {
      id: '2',
      name: 'Inventory System',
      description: 'Track inventory and stock levels',
      icon: 'package',
      color: '#10B981',
      fields: [],
      workflows: []
    }
  ]);

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateApp = (newApp: Omit<CustomApp, 'id'>) => {
    const app: CustomApp = {
      ...newApp,
      id: Date.now().toString()
    };
    setApps([...apps, app]);
    onAppSelect(app);
    setShowCreateDialog(false);
  };

  return (
    <div className="w-80 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">My Apps</h2>
          <Button 
            size="sm" 
            onClick={() => setShowCreateDialog(true)}
            className="h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              onClick={() => onAppSelect(app)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                currentApp?.id === app.id
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: app.color }}
                >
                  <AppWindow className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {app.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {app.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-8">
            <AppWindow className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">No apps found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? 'Try different search terms' : 'Create your first custom app'}
            </p>
          </div>
        )}
      </div>

      <CreateAppDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateApp={handleCreateApp}
      />
    </div>
  );
}
