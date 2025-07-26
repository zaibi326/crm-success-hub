
-- First, let's remove the foreign key constraint that's causing cascade deletion
-- and add a nullable campaign_id instead so leads can exist without campaigns

-- Remove the existing foreign key constraint (if it exists)
ALTER TABLE campaign_leads DROP CONSTRAINT IF EXISTS campaign_leads_campaign_id_fkey;

-- Make campaign_id nullable so leads can exist without campaigns
ALTER TABLE campaign_leads ALTER COLUMN campaign_id DROP NOT NULL;

-- Add a new foreign key constraint that doesn't cascade delete
-- This will set campaign_id to NULL when a campaign is deleted instead of deleting the lead
ALTER TABLE campaign_leads 
ADD CONSTRAINT campaign_leads_campaign_id_fkey 
FOREIGN KEY (campaign_id) REFERENCES campaigns(id) 
ON DELETE SET NULL;

-- Update RLS policies to allow users to view leads even when campaign_id is null
DROP POLICY IF EXISTS "Users can view leads for their campaigns" ON campaign_leads;
DROP POLICY IF EXISTS "Users can update leads for their campaigns" ON campaign_leads;
DROP POLICY IF EXISTS "Users can delete leads for their campaigns" ON campaign_leads;
DROP POLICY IF EXISTS "Users can create leads for their campaigns" ON campaign_leads;

-- Create new policies that handle both campaign-associated and orphaned leads
CREATE POLICY "Users can view their leads" ON campaign_leads
FOR SELECT USING (
  campaign_id IS NULL AND EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid()
  ) OR
  campaign_id IN (
    SELECT campaigns.id FROM campaigns WHERE campaigns.created_by = auth.uid()
  )
);

CREATE POLICY "Users can update their leads" ON campaign_leads
FOR UPDATE USING (
  campaign_id IS NULL AND EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid()
  ) OR
  campaign_id IN (
    SELECT campaigns.id FROM campaigns WHERE campaigns.created_by = auth.uid()
  )
);

CREATE POLICY "Users can delete their leads" ON campaign_leads
FOR DELETE USING (
  campaign_id IS NULL AND EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid()
  ) OR
  campaign_id IN (
    SELECT campaigns.id FROM campaigns WHERE campaigns.created_by = auth.uid()
  )
);

CREATE POLICY "Users can create leads" ON campaign_leads
FOR INSERT WITH CHECK (
  campaign_id IS NULL OR
  campaign_id IN (
    SELECT campaigns.id FROM campaigns WHERE campaigns.created_by = auth.uid()
  )
);
