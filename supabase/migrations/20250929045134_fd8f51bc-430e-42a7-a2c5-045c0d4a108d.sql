-- Add missing columns for comprehensive lead data storage
ALTER TABLE public.campaign_leads 
ADD COLUMN IF NOT EXISTS attached_files JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS heirs JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS has_death BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS death_notes TEXT,
ADD COLUMN IF NOT EXISTS has_probate BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS probate_notes TEXT,
ADD COLUMN IF NOT EXISTS has_lawsuit BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS lawsuit_notes TEXT,
ADD COLUMN IF NOT EXISTS has_additional_taxing_entities BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS additional_taxing_notes TEXT,
ADD COLUMN IF NOT EXISTS vesting_deed_date TEXT,
ADD COLUMN IF NOT EXISTS grantor_grantee_name TEXT,
ADD COLUMN IF NOT EXISTS owner_of_record TEXT;