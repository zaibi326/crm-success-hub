-- Fix the reset_activity_logs function to include WHERE clause
CREATE OR REPLACE FUNCTION public.reset_activity_logs()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'Admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can reset activity logs';
  END IF;
  
  -- Delete all activity logs with WHERE clause (required by PostgreSQL)
  DELETE FROM public.activities WHERE id IS NOT NULL;
  
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
$function$;