-- Fix privilege escalation vulnerability in handle_new_user trigger
-- This update ensures that ALL new signups are assigned 'Employee' role
-- regardless of any role data passed in metadata (which could be attacker-controlled)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles (without role column)
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  
  -- SECURITY FIX: ALWAYS assign 'Employee' role for new signups
  -- Do NOT read role from raw_user_meta_data - this is user-controlled and unsafe
  -- Admins can upgrade roles later through the admin panel with proper authorization
  INSERT INTO public.user_roles (user_id, role, created_by)
  VALUES (NEW.id, 'Employee'::app_role, NEW.id)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;