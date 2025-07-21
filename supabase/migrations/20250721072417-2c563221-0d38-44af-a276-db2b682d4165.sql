
-- Create activities table to store all user actions
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  module TEXT NOT NULL, -- 'leads', 'calendar', 'communication', 'settings', etc.
  action_type TEXT NOT NULL, -- 'created', 'edited', 'deleted', 'assigned', 'noted', 'commented', etc.
  description TEXT NOT NULL,
  reference_id TEXT, -- ID of the item being acted upon (lead ID, etc.)
  reference_type TEXT, -- 'lead', 'campaign', 'note', etc.
  metadata JSONB DEFAULT '{}', -- Additional data like old/new values
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at DESC);
CREATE INDEX idx_activities_module ON public.activities(module);
CREATE INDEX idx_activities_reference ON public.activities(reference_id, reference_type);

-- Enable Row Level Security
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all activities in their organization" 
  ON public.activities 
  FOR SELECT 
  USING (true); -- For now, allow all authenticated users to see activities

CREATE POLICY "Users can insert their own activities" 
  ON public.activities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime for the activities table
ALTER TABLE public.activities REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.activities;
