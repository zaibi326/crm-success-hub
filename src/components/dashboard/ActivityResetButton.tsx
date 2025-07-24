
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, RefreshCw } from 'lucide-react';
import { useActivityLogReset } from '@/hooks/useActivityLogReset';
import { useAuth } from '@/contexts/AuthContext';

export function ActivityResetButton() {
  const { profile } = useAuth();
  const { resetActivityLogs, isResetting } = useActivityLogReset();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Only show for Admin users
  if (profile?.role !== 'Admin') {
    return null;
  }

  const handleReset = () => {
    resetActivityLogs();
    setIsDialogOpen(false);
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          disabled={isResetting}
        >
          {isResetting ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4 mr-2" />
          )}
          Reset Activity Log
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-600" />
            Reset Activity Log
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reset all activity logs? This action cannot be undone and will permanently delete all activity records from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isResetting}
          >
            {isResetting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Reset All Logs
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
