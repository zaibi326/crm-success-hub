
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LogActivityParams {
  actionType: string;
  description: string;
  referenceId?: string;
  metadata?: any;
}

export function useEnhancedActivityLogger() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const logActivity = useMutation({
    mutationFn: async (params: LogActivityParams) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Get user name from profile or fallback to email
      const userName = profile 
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email || 'Unknown User'
        : user.email || 'Unknown User';

      console.log('Logging activity with user:', userName, 'for action:', params.actionType);

      // Use the database function for logging
      const { data, error } = await supabase
        .rpc('log_lead_activity', {
          p_user_id: user.id,
          p_user_name: userName,
          p_action_type: params.actionType,
          p_description: params.description,
          p_reference_id: params.referenceId || '',
          p_metadata: params.metadata || {}
        });

      if (error) {
        console.error('Error logging activity:', error);
        throw error;
      }

      console.log('Activity logged successfully:', data);
      return data;
    },
    onSuccess: () => {
      // Invalidate all activity-related queries to refresh everywhere
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['lead-activities'] });
      queryClient.invalidateQueries({ queryKey: ['campaign-leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
      queryClient.invalidateQueries({ queryKey: ['recent-activities'] });
      
      console.log('Activity logged and all queries invalidated');
    },
    onError: (error) => {
      console.error('Failed to log activity:', error);
      toast({
        title: "Activity Logging Failed",
        description: "Could not log the activity. Please try again.",
        variant: "destructive"
      });
    }
  });

  const logLeadActivity = async (params: LogActivityParams) => {
    return new Promise<void>((resolve, reject) => {
      logActivity.mutate(params, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error)
      });
    });
  };

  return {
    logLeadActivity,
    isLogging: logActivity.isPending
  };
}
