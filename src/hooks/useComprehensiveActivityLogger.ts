
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LogActivityParams {
  module: string;
  actionType: string;
  description: string;
  referenceId?: string;
  referenceType?: string;
  targetId?: string;
  targetType?: string;
  metadata?: any;
}

export function useComprehensiveActivityLogger() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const logActivity = useMutation({
    mutationFn: async (params: LogActivityParams) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Get user name from profile with better fallback logic
      let userName = 'Unknown User';
      if (profile?.first_name && profile?.last_name) {
        userName = `${profile.first_name} ${profile.last_name}`;
      } else if (profile?.first_name) {
        userName = profile.first_name;
      } else if (profile?.last_name) {
        userName = profile.last_name;
      } else if (profile?.email) {
        userName = profile.email;
      } else if (user.email) {
        userName = user.email;
      }

      // Get additional context
      const userAgent = navigator.userAgent;
      const sessionId = localStorage.getItem('session_id') || 'unknown';

      console.log('Logging comprehensive activity:', {
        user: userName,
        module: params.module,
        actionType: params.actionType,
        description: params.description,
        targetId: params.targetId
      });

      // Use the comprehensive logging function
      const { data, error } = await supabase
        .rpc('log_comprehensive_activity', {
          p_user_id: user.id,
          p_user_name: userName,
          p_module: params.module,
          p_action_type: params.actionType,
          p_description: params.description,
          p_reference_id: params.referenceId || null,
          p_reference_type: params.referenceType || null,
          p_target_id: params.targetId || null,
          p_target_type: params.targetType || null,
          p_metadata: params.metadata || {},
          p_user_agent: userAgent,
          p_session_id: sessionId
        });

      if (error) {
        console.error('Error logging comprehensive activity:', error);
        throw error;
      }

      console.log('Comprehensive activity logged successfully:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate all activity-related queries
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-activities'] });
      queryClient.invalidateQueries({ queryKey: ['recent-activities'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
      
      // Invalidate specific module queries if needed
      if (variables.referenceId) {
        queryClient.invalidateQueries({ queryKey: ['lead-activities', variables.referenceId] });
      }
      
      console.log('Comprehensive activity logged and queries invalidated');
    },
    onError: (error) => {
      console.error('Failed to log comprehensive activity:', error);
      toast({
        title: "Activity Logging Failed",
        description: "Could not log the activity. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Helper functions for different modules
  const logLeadActivity = (actionType: string, description: string, leadId?: string, metadata?: any) => {
    logActivity.mutate({
      module: 'leads',
      actionType,
      description,
      referenceId: leadId,
      referenceType: 'lead',
      targetId: leadId,
      targetType: 'lead',
      metadata
    });
  };

  const logCampaignActivity = (actionType: string, description: string, campaignId?: string, metadata?: any) => {
    logActivity.mutate({
      module: 'campaigns',
      actionType,
      description,
      referenceId: campaignId,
      referenceType: 'campaign',
      targetId: campaignId,
      targetType: 'campaign',
      metadata
    });
  };

  const logCommunicationActivity = (actionType: string, description: string, targetId?: string, metadata?: any) => {
    logActivity.mutate({
      module: 'communication',
      actionType,
      description,
      targetId,
      targetType: 'communication',
      metadata
    });
  };

  const logCalendarActivity = (actionType: string, description: string, eventId?: string, metadata?: any) => {
    logActivity.mutate({
      module: 'calendar',
      actionType,
      description,
      referenceId: eventId,
      referenceType: 'event',
      targetId: eventId,
      targetType: 'event',
      metadata
    });
  };

  const logSettingsActivity = (actionType: string, description: string, metadata?: any) => {
    logActivity.mutate({
      module: 'settings',
      actionType,
      description,
      metadata
    });
  };

  const logAuthActivity = (actionType: string, description: string, metadata?: any) => {
    logActivity.mutate({
      module: 'auth',
      actionType,
      description,
      metadata
    });
  };

  const logOrganizationActivity = (actionType: string, description: string, orgId?: string, metadata?: any) => {
    logActivity.mutate({
      module: 'organization',
      actionType,
      description,
      referenceId: orgId,
      referenceType: 'organization',
      targetId: orgId,
      targetType: 'organization',
      metadata
    });
  };

  const logNotificationActivity = (actionType: string, description: string, metadata?: any) => {
    logActivity.mutate({
      module: 'notifications',
      actionType,
      description,
      metadata
    });
  };

  return {
    logActivity: logActivity.mutate,
    logLeadActivity,
    logCampaignActivity,
    logCommunicationActivity,
    logCalendarActivity,
    logSettingsActivity,
    logAuthActivity,
    logOrganizationActivity,
    logNotificationActivity,
    isLogging: logActivity.isPending
  };
}
