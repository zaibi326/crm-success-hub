
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CampaignLead {
  id?: string;
  campaign_id: string;
  tax_id?: string;
  owner_name: string;
  property_address: string;
  tax_lawsuit_number?: string;
  current_arrears?: number;
  phone?: string;
  email?: string;
  status?: string;
  notes?: string;
}

export function useCampaignLeads() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const createLeadsFromCSV = async (campaignId: string, leads: CampaignLead[]) => {
    setUploading(true);
    try {
      const leadsWithCampaignId = leads.map(lead => ({
        ...lead,
        campaign_id: campaignId,
        status: lead.status || 'NEW'
      }));

      const { data, error } = await supabase
        .from('campaign_leads')
        .insert(leadsWithCampaignId)
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully imported ${data.length} leads`
      });
      
      return data;
    } catch (error) {
      console.error('Error creating leads:', error);
      toast({
        title: "Error",
        description: "Failed to import leads",
        variant: "destructive"
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const getCampaignLeads = async (campaignId: string) => {
    try {
      const { data, error } = await supabase
        .from('campaign_leads')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching campaign leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch campaign leads",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    uploading,
    createLeadsFromCSV,
    getCampaignLeads
  };
}
