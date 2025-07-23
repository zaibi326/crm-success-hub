
-- Extend the activities table to support lead-specific activities if not already covered
-- Add indexes for better performance on lead activities
CREATE INDEX IF NOT EXISTS idx_activities_lead_reference ON public.activities(reference_id, reference_type) WHERE reference_type = 'lead';

-- Create a function to automatically log lead activities
CREATE OR REPLACE FUNCTION log_lead_activity(
  p_user_id UUID,
  p_user_name TEXT,
  p_action_type TEXT,
  p_description TEXT,
  p_reference_id TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
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
    metadata
  ) VALUES (
    p_user_id,
    p_user_name,
    'leads',
    p_action_type,
    p_description,
    p_reference_id,
    'lead',
    p_metadata
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION log_lead_activity TO authenticated;
