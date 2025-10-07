-- Add created_by and lead_manager columns to campaign_leads table
-- These will store references to actual users for proper filtering

ALTER TABLE public.campaign_leads
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS lead_manager uuid REFERENCES auth.users(id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_campaign_leads_created_by ON public.campaign_leads(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_leads_lead_manager ON public.campaign_leads(lead_manager);

-- Set created_by to the first user for existing leads (one-time data migration)
-- This ensures existing data has a valid created_by value
UPDATE public.campaign_leads
SET created_by = (SELECT id FROM auth.users LIMIT 1)
WHERE created_by IS NULL;