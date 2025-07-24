
-- Extend the existing activities table to support comprehensive logging
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS target_id TEXT;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS target_type TEXT;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activities_target ON public.activities(target_id, target_type);
CREATE INDEX IF NOT EXISTS idx_activities_user_module ON public.activities(user_id, module);
CREATE INDEX IF NOT EXISTS idx_activities_action_type ON public.activities(action_type);

-- Create a comprehensive activity logging function
CREATE OR REPLACE FUNCTION log_comprehensive_activity(
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
) RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
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
    session_id
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
    p_session_id
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION log_comprehensive_activity TO authenticated;

-- Create a function to reset activity logs (Admin only)
CREATE OR REPLACE FUNCTION reset_activity_logs()
RETURNS VOID AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'Admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can reset activity logs';
  END IF;
  
  -- Delete all activity logs
  DELETE FROM public.activities;
  
  -- Log the reset action
  INSERT INTO public.activities (
    user_id,
    user_name,
    module,
    action_type,
    description,
    metadata
  ) VALUES (
    auth.uid(),
    (SELECT CONCAT(first_name, ' ', last_name) FROM public.profiles WHERE id = auth.uid()),
    'system',
    'reset_logs',
    'Activity logs have been reset by administrator',
    jsonb_build_object('reset_timestamp', now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (function will check admin role internally)
GRANT EXECUTE ON FUNCTION reset_activity_logs TO authenticated;

-- Create RLS policy for admins to delete activities
CREATE POLICY "Admins can delete activities" 
  ON public.activities 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );
