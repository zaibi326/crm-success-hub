-- Critical Security Fixes - Proper Order

-- 1. Drop all policies that depend on profiles.role column
DROP POLICY IF EXISTS "Admins and Managers can manage apps" ON public.custom_apps;
DROP POLICY IF EXISTS "Admins and Managers can manage app fields" ON public.custom_app_fields;
DROP POLICY IF EXISTS "Admins and Managers can manage workflows" ON public.workflows;
DROP POLICY IF EXISTS "Admins can delete activities" ON public.activities;

-- 2. Ensure all existing roles are in user_roles table before dropping column
INSERT INTO public.user_roles (user_id, role, created_by)
SELECT id, role::app_role, id
FROM public.profiles
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = profiles.id AND ur.role = profiles.role::app_role
);

-- 3. Now drop the role column from profiles
ALTER TABLE public.profiles DROP COLUMN role;

-- 4. Recreate policies using has_role function
CREATE POLICY "Admins and Managers can manage apps"
ON public.custom_apps
FOR ALL
USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  ) AND (
    public.has_role(auth.uid(), 'Admin'::app_role) OR 
    public.has_role(auth.uid(), 'Manager'::app_role)
  )
);

CREATE POLICY "Admins and Managers can manage app fields"
ON public.custom_app_fields
FOR ALL
USING (
  app_id IN (
    SELECT id FROM public.custom_apps 
    WHERE organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  ) AND (
    public.has_role(auth.uid(), 'Admin'::app_role) OR 
    public.has_role(auth.uid(), 'Manager'::app_role)
  )
);

CREATE POLICY "Admins and Managers can manage workflows"
ON public.workflows
FOR ALL
USING (
  app_id IN (
    SELECT id FROM public.custom_apps 
    WHERE organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  ) AND (
    public.has_role(auth.uid(), 'Admin'::app_role) OR 
    public.has_role(auth.uid(), 'Manager'::app_role)
  )
);

CREATE POLICY "Admins can delete activities"
ON public.activities
FOR DELETE
USING (public.has_role(auth.uid(), 'Admin'::app_role));

-- 5. Fix password_reset_tokens policy - restrict to SELECT and UPDATE only
DROP POLICY IF EXISTS "Users can access their own reset tokens" ON public.password_reset_tokens;

CREATE POLICY "Users can view their own reset tokens"
ON public.password_reset_tokens
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own reset tokens"
ON public.password_reset_tokens
FOR UPDATE
USING (auth.uid() = user_id);

-- 6. Fix campaigns policies to use organization-based filtering
DROP POLICY IF EXISTS "Users can view campaigns they created" ON public.campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update their campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete their campaigns" ON public.campaigns;

CREATE POLICY "Users can view campaigns in their org"
ON public.campaigns
FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can create campaigns in their org"
ON public.campaigns
FOR INSERT
WITH CHECK (
  auth.uid() = created_by AND
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can update campaigns in their org"
ON public.campaigns
FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can delete campaigns in their org"
ON public.campaigns
FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id FROM public.profiles WHERE id = auth.uid()
  )
);