
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LogActivityParams {
  module: string;
  actionType: string;
  description: string;
  referenceId?: string;
  referenceType?: string;
  metadata?: any;
}

export function useActivityLogger() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const logActivity = useMutation({
    mutationFn: async (params: LogActivityParams) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Get user name from profile or fallback to email
      const userName = profile 
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email || 'Unknown User'
        : user.email || 'Unknown User';

      const { data, error } = await supabase
        .from('activities')
        .insert({
          user_id: user.id,
          user_name: userName,
          module: params.module,
          action_type: params.actionType,
          description: params.description,
          reference_id: params.referenceId,
          reference_type: params.referenceType,
          metadata: params.metadata || {}
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
    },
    onError: (error) => {
      console.error('Failed to log activity:', error);
    }
  });

  return {
    logActivity: logActivity.mutate,
    isLogging: logActivity.isPending
  };
}
