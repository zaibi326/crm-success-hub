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
    const trimmedName = viewName.trim();
    console.log('Attempting to save view:', { viewName, trimmedName, filtersLength: filters.length });
    
    if (!trimmedName) {
      console.log('Name validation failed - empty name');
      toast.error('Please enter a view name');
      return;
    }

    if (filters.length === 0) {
      console.log('Filters validation failed - no filters');
      toast.error('No filters to save');
      return;
    }

    try {
      console.log('Calling saveFilter with:', trimmedName, filters);
      const savedFilter = saveFilter(trimmedName, filters);
      console.log('Filter saved successfully:', savedFilter);
      toast.success(`View "${trimmedName}" saved successfully!`);
      setViewName('');
      onClose();
    } catch (error) {
      console.error('Save filter error:', error);
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
              onChange={(e) => {
                console.log('Input value changed:', e.target.value);
                setViewName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && viewName.trim()) {
                  console.log('Enter key pressed, calling handleSave');
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
          <Button onClick={() => {
            console.log('Save button clicked, viewName:', viewName);
            handleSave();
          }} disabled={!viewName.trim()}>
            Save View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}