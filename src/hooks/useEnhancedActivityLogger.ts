
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

      return data;
    },
    onSuccess: () => {
      // Invalidate activities query to refresh the feed
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['lead-activities'] });
    },
    onError: (error) => {
      console.error('Failed to log activity:', error);
    }
  });

  const logLeadActivity = (params: LogActivityParams) => {
    logActivity.mutate(params);
  };

  return {
    logLeadActivity,
    isLogging: logActivity.isPending
  };
}
