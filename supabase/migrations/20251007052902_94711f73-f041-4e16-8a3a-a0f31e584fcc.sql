-- Fix infinite recursion in profiles RLS policy
-- Create security definer function to get user's organization_id without triggering RLS
CREATE OR REPLACE FUNCTION public.get_user_organization_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE id = _user_id LIMIT 1;
$$;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all profiles in org" ON public.profiles;

-- Recreate the policy using the security definer function
CREATE POLICY "Admins can view all profiles in org"
ON public.profiles
FOR SELECT
USING (
  (auth.uid() = id) OR 
  (
    public.has_role(auth.uid(), 'Admin'::app_role) AND 
    organization_id = public.get_user_organization_id(auth.uid())
  )
);