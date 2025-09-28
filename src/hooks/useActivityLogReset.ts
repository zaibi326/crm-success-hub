
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useActivityLogReset() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const resetActivityLogs = useMutation({
    mutationFn: async () => {
      console.log('Resetting activity logs...');
      
      const { data, error } = await supabase
        .rpc('reset_activity_logs');

      if (error) {
        console.error('Error resetting activity logs:', error);
        throw error;
      }

      console.log('Activity logs reset successfully:', data);
      return data;
    },
    onSuccess: () => {
      // Invalidate all activity-related queries
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
      queryClient.invalidateQueries({ queryKey: ['recent-activities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
      queryClient.invalidateQueries({ queryKey: ['lead-activities'] });
      
      toast({
        title: "Activity Logs Reset",
        description: "All activity logs have been successfully reset.",
      });
    },
    onError: (error: any) => {
      console.error('Failed to reset activity logs:', error);
      toast({
        title: "Reset Failed",
        description: error.message || "Could not reset activity logs. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    resetActivityLogs: resetActivityLogs.mutate,
    isResetting: resetActivityLogs.isPending
  };
}
