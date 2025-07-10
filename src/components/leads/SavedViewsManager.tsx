
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, EyeOff, Trash2, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SavedView {
  id: string;
  name: string;
  type: 'public' | 'private';
  filters: Record<string, any>;
  createdBy: string;
  createdAt: Date;
}

interface SavedViewsManagerProps {
  views: SavedView[];
  onSaveView: (view: Omit<SavedView, 'id' | 'createdAt'>) => void;
  onDeleteView: (viewId: string) => void;
  onApplyView: (view: SavedView) => void;
}

export function SavedViewsManager({ views, onSaveView, onDeleteView, onApplyView }: SavedViewsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [newViewType, setNewViewType] = useState<'public' | 'private'>('private');
  const { toast } = useToast();

  const handleSaveView = () => {
    if (!newViewName.trim()) {
      toast({
        title: "View name required",
        description: "Please enter a name for the view",
        variant: "destructive"
      });
      return;
    }

    onSaveView({
      name: newViewName,
      type: newViewType,
      filters: {}, // Current filters would be passed here
      createdBy: 'current-user' // Would be actual user ID
    });

    setNewViewName('');
    setNewViewType('private');
    setIsDialogOpen(false);
    
    toast({
      title: "View saved",
      description: `"${newViewName}" has been saved successfully`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Saved Views</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Save Current View
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save View</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="viewName">View Name</Label>
                  <Input
                    id="viewName"
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    placeholder="Enter view name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="viewType">Visibility</Label>
                  <Select value={newViewType} onValueChange={(value: 'public' | 'private') => setNewViewType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private (Only me)</SelectItem>
                      <SelectItem value="public">Public (Team shared)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveView}>
                    Save View
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {views.length === 0 ? (
          <p className="text-gray-500 text-sm">No saved views yet</p>
        ) : (
          views.map((view) => (
            <div key={view.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onApplyView(view)}
                  className="text-left justify-start"
                >
                  {view.name}
                </Button>
                <Badge variant={view.type === 'public' ? 'default' : 'secondary'} className="text-xs">
                  {view.type === 'public' ? (
                    <><Share className="w-3 h-3 mr-1" />Public</>
                  ) : (
                    <><EyeOff className="w-3 h-3 mr-1" />Private</>
                  )}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteView(view.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
