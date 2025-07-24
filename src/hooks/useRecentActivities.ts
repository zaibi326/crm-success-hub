
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface RecentActivity {
  id: string;
  user_id: string;
  user_name: string;
  module: string;
  action_type: string;
  description: string;
  reference_id: string | null;
  reference_type: string | null;
  target_id: string | null;
  target_type: string | null;
  metadata: any;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
}

export function useRecentActivities(limit: number = 50) {
  const { data: activities = [], isLoading, error, refetch } = useQuery({
    queryKey: ['recent-activities', limit],
    queryFn: async () => {
      console.log('Fetching recent activities...');

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent activities:', error);
        throw error;
      }

      console.log('Fetched recent activities:', data?.length || 0, 'activities');
      return data || [];
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // Refetch every minute for real-time updates
  });

  // Set up real-time subscription for activities
  useEffect(() => {
    const channel = supabase
      .channel('recent-activities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities'
        },
        (payload) => {
          console.log('Real-time activity update:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return {
    activities,
    isLoading,
    error,
    refetch
  };
}
