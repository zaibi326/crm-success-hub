
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
      // Fetch profiles with their roles from user_roles table
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .order('first_name', { ascending: true });

      if (profileError) {
        console.error('Error fetching users:', profileError);
        throw profileError;
      }

      // Fetch roles for all users
      const { data: roles, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (roleError) {
        console.error('Error fetching user roles:', roleError);
        throw roleError;
      }

      // Combine profiles with roles
      return (profiles || []).map((user): RealUser => {
        const validRoles: ('Admin' | 'Manager' | 'Lead Manager' | 'Employee' | 'Guest')[] = [
          'Admin', 'Manager', 'Lead Manager', 'Employee', 'Guest'
        ];
        
        // Find user's role from user_roles table
        const userRoleRecord = roles?.find(r => r.user_id === user.id);
        const userRole = userRoleRecord && validRoles.includes(userRoleRecord.role as any) 
          ? userRoleRecord.role as RealUser['role'] 
          : 'Employee';
        
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
