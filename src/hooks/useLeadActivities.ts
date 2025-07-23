
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseActivityItem {
  id: string;
  user_id: string;
  user_name: string;
  module: string;
  action_type: string;
  description: string;
  reference_id: string | null;
  reference_type: string | null;
  metadata: any;
  created_at: string;
}

export function useLeadActivities(leadId?: string) {
  return useQuery({
    queryKey: ['lead-activities', leadId],
    queryFn: async () => {
      if (!leadId) {
        console.log('No leadId provided to useLeadActivities');
        return [];
      }

      console.log('Fetching activities for lead:', leadId);

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('reference_id', leadId)
        .eq('reference_type', 'lead')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lead activities:', error);
        throw error;
      }

      console.log('Fetched activities:', data?.length || 0, 'activities for lead', leadId);
      return data || [];
    },
    enabled: !!leadId,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // Refetch every minute
  });
}
