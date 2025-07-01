
-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a security definer function to get user role without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create a non-recursive policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT
USING (
  -- Allow users to see their own profile
  auth.uid() = id 
  OR 
  -- Allow admins to see all profiles (using security definer function to avoid recursion)
  public.get_current_user_role() = 'Admin'
);
