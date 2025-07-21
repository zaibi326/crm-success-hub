
-- Add disposition column to campaign_leads table
ALTER TABLE public.campaign_leads 
ADD COLUMN disposition text DEFAULT 'UNDECIDED' CHECK (disposition IN ('UNDECIDED', 'QUALIFIED', 'DISQUALIFIED'));
