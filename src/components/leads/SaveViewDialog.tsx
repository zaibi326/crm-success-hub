import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilterCondition } from './filters/types';
import { useSavedFilters } from '@/hooks/useSavedFilters';
import { toast } from 'sonner';

interface SaveViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterCondition[];
}

export function SaveViewDialog({ isOpen, onClose, filters }: SaveViewDialogProps) {
  const [viewName, setViewName] = useState('');
  const { saveFilter } = useSavedFilters();

  const handleSave = () => {
    if (!viewName.trim()) {
      toast.error('Please enter a view name');
      return;
    }

    if (filters.length === 0) {
      toast.error('No filters to save');
      return;
    }

    try {
      saveFilter(viewName.trim(), filters);
      toast.success(`View "${viewName.trim()}" saved successfully!`);
      setViewName('');
      onClose();
    } catch (error) {
      toast.error('Failed to save view');
    }
  };

  const handleClose = () => {
    setViewName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Filter View</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="viewName">View Name</Label>
            <Input
              id="viewName"
              placeholder="Enter a name for this view..."
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && viewName.trim()) {
                  handleSave();
                }
              }}
              autoFocus
            />
          </div>
          
          <div className="text-sm text-gray-600">
            This will save your current filter configuration ({filters.length} filter{filters.length !== 1 ? 's' : ''}) for future use.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!viewName.trim()}>
            Save View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}