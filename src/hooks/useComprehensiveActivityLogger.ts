
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
  const { user, profile, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const logActivity = useMutation({
    mutationFn: async (params: LogActivityParams) => {
      // Early return if user is not authenticated or still loading
      if (!user?.id || isLoading) {
        console.log('Activity logging skipped: user not authenticated or still loading');
        return null;
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

      // Get additional context with safe access
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
      const sessionId = typeof localStorage !== 'undefined' 
        ? localStorage.getItem('session_id') || 'unknown'
        : 'unknown';

      console.log('Logging comprehensive activity:', {
        user: userName,
        module: params.module,
        actionType: params.actionType,
        description: params.description,
        targetId: params.targetId
      });

      try {
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
      } catch (error) {
        console.error('Failed to log activity:', error);
        // Don't throw error to prevent breaking the UI
        return null;
      }
    },
    onSuccess: (data, variables) => {
      // Only invalidate queries if logging was successful
      if (data !== null) {
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
      }
    },
    onError: (error) => {
      console.error('Failed to log comprehensive activity:', error);
      // Only show toast if user is authenticated to avoid spam
      if (user?.id && !isLoading) {
        toast({
          title: "Activity Logging Failed",
          description: "Could not log the activity. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  // Helper functions for different modules with safety checks
  const logLeadActivity = (actionType: string, description: string, leadId?: string, metadata?: any) => {
    if (!user?.id || isLoading) return;
    
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

  // Enhanced lead-specific activity functions
  const logLeadStatusChange = (leadId: string, leadName: string, oldStatus: string, newStatus: string, metadata?: any) => {
    if (!user?.id || isLoading) return;
    
    logActivity.mutate({
      module: 'leads',
      actionType: 'status_change',
      description: `Changed lead status from "${oldStatus}" to "${newStatus}" for ${leadName}`,
      referenceId: leadId,
      referenceType: 'lead',
      targetId: leadId,
      targetType: 'lead',
      metadata: { oldStatus, newStatus, leadName, ...metadata }
    });
  };

  const logLeadDispositionChange = (leadId: string, leadName: string, disposition: 'keep' | 'pass', reason?: string, metadata?: any) => {
    if (!user?.id || isLoading) return;
    
    const actionType = disposition === 'keep' ? 'keep_lead' : 'pass_lead';
    const description = `Marked lead as "${disposition.toUpperCase()}" for ${leadName}${reason ? ` - Reason: ${reason}` : ''}`;
    
    logActivity.mutate({
      module: 'leads',
      actionType,
      description,
      referenceId: leadId,
      referenceType: 'lead',
      targetId: leadId,
      targetType: 'lead',
      metadata: { disposition, reason, leadName, ...metadata }
    });
  };

  const logDocumentUpload = (leadId: string, leadName: string, fileName: string, fileType: string, metadata?: any) => {
    if (!user?.id || isLoading) return;
    
    logActivity.mutate({
      module: 'leads',
      actionType: 'document_upload',
      description: `Uploaded document "${fileName}" for ${leadName}`,
      referenceId: leadId,
      referenceType: 'lead',
      targetId: leadId,
      targetType: 'lead',
      metadata: { fileName, fileType, leadName, ...metadata }
    });
  };

  const logHeirAddition = (leadId: string, leadName: string, heirName: string, relationship?: string, metadata?: any) => {
    if (!user?.id || isLoading) return;
    
    logActivity.mutate({
      module: 'leads',
      actionType: 'heir_added',
      description: `Added heir "${heirName}"${relationship ? ` (${relationship})` : ''} to ${leadName}`,
      referenceId: leadId,
      referenceType: 'lead',
      targetId: leadId,
      targetType: 'lead',
      metadata: { heirName, relationship, leadName, ...metadata }
    });
  };

  const logLeadFieldUpdate = (leadId: string, leadName: string, fieldName: string, oldValue: string, newValue: string, metadata?: any) => {
    if (!user?.id || isLoading) return;
    
    logActivity.mutate({
      module: 'leads',
      actionType: 'field_updated',
      description: `Updated ${fieldName} from "${oldValue}" to "${newValue}" for ${leadName}`,
      referenceId: leadId,
      referenceType: 'lead',
      targetId: leadId,
      targetType: 'lead',
      metadata: { fieldName, oldValue, newValue, leadName, ...metadata }
    });
  };

  const logLeadNote = (leadId: string, leadName: string, noteContent: string, metadata?: any) => {
    if (!user?.id || isLoading) return;
    
    logActivity.mutate({
      module: 'leads',
      actionType: 'note_added',
      description: `Added note for ${leadName}: "${noteContent.substring(0, 100)}${noteContent.length > 100 ? '...' : ''}"`,
      referenceId: leadId,
      referenceType: 'lead',
      targetId: leadId,
      targetType: 'lead',
      metadata: { noteContent, leadName, ...metadata }
    });
  };

  const logCampaignActivity = (actionType: string, description: string, campaignId?: string, metadata?: any) => {
    if (!user?.id || isLoading) return;
    
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
    if (!user?.id || isLoading) return;
    
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
    if (!user?.id || isLoading) return;
    
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
    if (!user?.id || isLoading) return;
    
    logActivity.mutate({
      module: 'settings',
      actionType,
      description,
      metadata
    });
  };

  const logAuthActivity = (actionType: string, description: string, metadata?: any) => {
    if (!user?.id || isLoading) return;
    
    logActivity.mutate({
      module: 'auth',
      actionType,
      description,
      metadata
    });
  };

  const logOrganizationActivity = (actionType: string, description: string, orgId?: string, metadata?: any) => {
    if (!user?.id || isLoading) return;
    
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
    if (!user?.id || isLoading) return;
    
    logActivity.mutate({
      module: 'notifications',
      actionType,
      description,
      metadata
    });
  };

  return {
    logActivity: (params: LogActivityParams) => {
      if (!user?.id || isLoading) return;
      logActivity.mutate(params);
    },
    logLeadActivity,
    logLeadStatusChange,
    logLeadDispositionChange,
    logDocumentUpload,
    logHeirAddition,
    logLeadFieldUpdate,
    logLeadNote,
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
