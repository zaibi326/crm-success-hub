
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RealUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'Admin' | 'Manager' | 'Lead Manager' | 'Employee' | 'Guest';
  display_name: string;
}

export function useRealUsers() {
  return useQuery({
    queryKey: ['real-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role')
        .order('first_name', { ascending: true });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return (data || []).map((user): RealUser => {
        const validRoles: ('Admin' | 'Manager' | 'Lead Manager' | 'Employee' | 'Guest')[] = [
          'Admin', 'Manager', 'Lead Manager', 'Employee', 'Guest'
        ];
        
        const userRole = validRoles.includes(user.role as any) ? user.role as RealUser['role'] : 'Employee';
        
        return {
          ...user,
          role: userRole,
          display_name: user.first_name && user.last_name 
            ? `${user.first_name} ${user.last_name}`
            : user.email
        };
      });
    },
  });
}
