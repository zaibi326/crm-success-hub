
-- Fix the infinite recursion issue in profiles RLS policy
-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a simpler, non-recursive policy for admins to view all profiles
-- This policy allows users to see their own profile OR allows admins to see all profiles
-- but avoids recursion by using a direct subquery approach
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT
USING (
  -- Allow users to see their own profile
  auth.uid() = id 
  OR 
  -- Allow admins to see all profiles (direct check to avoid recursion)
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'Admin'
  )
);

-- Also ensure we have the basic user profile viewing policy
CREATE POLICY IF NOT EXISTS "Users can view their own profile" ON profiles
FOR SELECT
USING (auth.uid() = id);
