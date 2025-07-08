
-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  budget DECIMAL(12,2),
  target_deals INTEGER,
  status TEXT NOT NULL DEFAULT 'draft',
  progress INTEGER DEFAULT 0,
  signed_deals INTEGER DEFAULT 0,
  equity_purchased DECIMAL(12,2) DEFAULT 0,
  expenditure DECIMAL(12,2) DEFAULT 0,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign_leads table to store leads associated with campaigns
CREATE TABLE public.campaign_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  tax_id TEXT,
  owner_name TEXT NOT NULL,
  property_address TEXT NOT NULL,
  tax_lawsuit_number TEXT,
  current_arrears DECIMAL(10,2),
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'NEW',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view campaigns they created" 
  ON public.campaigns 
  FOR SELECT 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create campaigns" 
  ON public.campaigns 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their campaigns" 
  ON public.campaigns 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their campaigns" 
  ON public.campaigns 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Add RLS policies for campaign_leads
ALTER TABLE public.campaign_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view leads for their campaigns" 
  ON public.campaign_leads 
  FOR SELECT 
  USING (campaign_id IN (SELECT id FROM public.campaigns WHERE created_by = auth.uid()));

CREATE POLICY "Users can create leads for their campaigns" 
  ON public.campaign_leads 
  FOR INSERT 
  WITH CHECK (campaign_id IN (SELECT id FROM public.campaigns WHERE created_by = auth.uid()));

CREATE POLICY "Users can update leads for their campaigns" 
  ON public.campaign_leads 
  FOR UPDATE 
  USING (campaign_id IN (SELECT id FROM public.campaigns WHERE created_by = auth.uid()));

CREATE POLICY "Users can delete leads for their campaigns" 
  ON public.campaign_leads 
  FOR DELETE 
  USING (campaign_id IN (SELECT id FROM public.campaigns WHERE created_by = auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_campaigns_created_by ON public.campaigns(created_by);
CREATE INDEX idx_campaigns_created_at ON public.campaigns(created_at DESC);
CREATE INDEX idx_campaign_leads_campaign_id ON public.campaign_leads(campaign_id);
