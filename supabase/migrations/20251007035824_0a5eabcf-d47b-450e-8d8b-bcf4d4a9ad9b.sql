-- ============================================
-- CRITICAL SECURITY FIXES
-- ============================================

-- 1. Create app_role enum for proper role type safety
CREATE TYPE public.app_role AS ENUM ('Admin', 'Manager', 'Lead Manager', 'Employee', 'Guest');

-- 2. Create user_roles table (proper role storage, prevents privilege escalation)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. Migrate existing role data from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role
FROM public.profiles
WHERE role IN ('Admin', 'Manager', 'Lead Manager', 'Employee', 'Guest')
ON CONFLICT (user_id, role) DO NOTHING;

-- 5. Add organization_id to profiles for multi-tenant isolation
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization_id UUID;

-- 6. Add organization_id to activities for proper access control
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS organization_id UUID;

-- 7. Add organization_id to campaigns
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS organization_id UUID;

-- 8. Add organization_id to campaign_leads
ALTER TABLE public.campaign_leads ADD COLUMN IF NOT EXISTS organization_id UUID;

-- 9. Update activities RLS policy - REMOVE the vulnerable "true" policy
DROP POLICY IF EXISTS "Users can view all activities in their organization" ON public.activities;

-- Create proper organization-scoped policy
CREATE POLICY "Users view activities in their org"
ON public.activities FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- 10. Update profiles RLS policies to use has_role function
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles in org"
ON public.profiles FOR SELECT
USING (
  (auth.uid() = id) OR 
  (public.has_role(auth.uid(), 'Admin') AND organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  ))
);

-- 11. Fix security definer functions - add SET search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.log_lead_activity(
  p_user_id UUID,
  p_user_name TEXT,
  p_action_type TEXT,
  p_description TEXT,
  p_reference_id TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  activity_id UUID;
  user_org_id UUID;
BEGIN
  -- Get user's organization_id
  SELECT organization_id INTO user_org_id FROM public.profiles WHERE id = p_user_id;
  
  INSERT INTO public.activities (
    user_id,
    user_name,
    module,
    action_type,
    description,
    reference_id,
    reference_type,
    metadata,
    organization_id
  ) VALUES (
    p_user_id,
    p_user_name,
    'leads',
    p_action_type,
    p_description,
    p_reference_id,
    'lead',
    p_metadata,
    user_org_id
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_comprehensive_activity(
  p_user_id UUID,
  p_user_name TEXT,
  p_module TEXT,
  p_action_type TEXT,
  p_description TEXT,
  p_reference_id TEXT DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL,
  p_target_id TEXT DEFAULT NULL,
  p_target_type TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  activity_id UUID;
  user_org_id UUID;
BEGIN
  -- Get user's organization_id
  SELECT organization_id INTO user_org_id FROM public.profiles WHERE id = p_user_id;
  
  INSERT INTO public.activities (
    user_id,
    user_name,
    module,
    action_type,
    description,
    reference_id,
    reference_type,
    target_id,
    target_type,
    metadata,
    ip_address,
    user_agent,
    session_id,
    organization_id
  ) VALUES (
    p_user_id,
    p_user_name,
    p_module,
    p_action_type,
    p_description,
    p_reference_id,
    p_reference_type,
    p_target_id,
    p_target_type,
    p_metadata,
    p_ip_address,
    p_user_agent,
    p_session_id,
    user_org_id
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.reset_activity_logs()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_org_id UUID;
BEGIN
  -- Check if the current user is an admin
  IF NOT public.has_role(auth.uid(), 'Admin') THEN
    RAISE EXCEPTION 'Only administrators can reset activity logs';
  END IF;
  
  -- Get user's organization
  SELECT organization_id INTO user_org_id FROM public.profiles WHERE id = auth.uid();
  
  -- Delete only organization's activity logs
  DELETE FROM public.activities WHERE organization_id = user_org_id;
  
  -- Log the reset action
  INSERT INTO public.activities (
    user_id,
    user_name,
    module,
    action_type,
    description,
    metadata,
    organization_id
  ) VALUES (
    auth.uid(),
    (SELECT CONCAT(first_name, ' ', last_name) FROM public.profiles WHERE id = auth.uid()),
    'system',
    'reset_logs',
    'Activity logs have been reset by administrator',
    jsonb_build_object('reset_timestamp', now()),
    user_org_id
  );
END;
$$;

-- 12. Update handle_new_user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  -- Get role from metadata, default to 'Employee'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'Employee');
  
  -- Insert into profiles (without role column)
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  
  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role, created_by)
  VALUES (NEW.id, user_role::app_role, NEW.id)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 13. Create RLS policy for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles in their org"
ON public.user_roles FOR ALL
USING (
  public.has_role(auth.uid(), 'Admin') AND
  user_id IN (
    SELECT id FROM public.profiles 
    WHERE organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  )
);

-- 14. Update campaign_leads RLS policies for organization isolation
DROP POLICY IF EXISTS "Users can view their leads" ON public.campaign_leads;

CREATE POLICY "Users view leads in their org"
ON public.campaign_leads FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update their leads" ON public.campaign_leads;

CREATE POLICY "Users update leads in their org"
ON public.campaign_leads FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete their leads" ON public.campaign_leads;

CREATE POLICY "Users delete leads in their org"
ON public.campaign_leads FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can create leads" ON public.campaign_leads;

CREATE POLICY "Users create leads in their org"
ON public.campaign_leads FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);