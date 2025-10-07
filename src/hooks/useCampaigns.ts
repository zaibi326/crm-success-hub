import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCampaignActivityTracking } from './useCampaignActivityTracking';
import { validateCampaignData } from '@/utils/validation';
import { z } from 'zod';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  budget?: number;
  target_deals?: number;
  status: string;
  progress: number;
  signed_deals: number;
  equity_purchased: number;
  expenditure: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { trackCampaignCreated, trackCampaignUpdated, trackCampaignDeleted } = useCampaignActivityTracking();

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'created_by' | 'created_at' | 'updated_at' | 'progress' | 'signed_deals' | 'equity_purchased' | 'expenditure'>) => {
    try {
      // Validate input data before processing
      try {
        validateCampaignData(campaignData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast({
            title: "Validation Error",
            description: error.errors[0].message,
            variant: "destructive"
          });
          throw error;
        }
        throw error;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          ...campaignData,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setCampaigns(prev => [data, ...prev]);
      trackCampaignCreated(data);
      toast({
        title: "Success",
        description: "Campaign created successfully"
      });
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    try {
      // Validate input data if critical fields are being updated
      const criticalFields = ['name', 'budget', 'start_date', 'end_date', 'target_deals'];
      const hasCriticalUpdate = Object.keys(updates).some(key => criticalFields.includes(key));
      
      if (hasCriticalUpdate) {
        const originalCampaign = campaigns.find(c => c.id === id);
        const dataToValidate = { ...originalCampaign, ...updates };
        
        try {
          validateCampaignData(dataToValidate);
        } catch (error) {
          if (error instanceof z.ZodError) {
            toast({
              title: "Validation Error",
              description: error.errors[0].message,
              variant: "destructive"
            });
            throw error;
          }
          throw error;
        }
      }

      const originalCampaign = campaigns.find(c => c.id === id);
      const changedFields = Object.keys(updates);
      
      const { data, error } = await supabase
        .from('campaigns')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCampaigns(prev => prev.map(c => c.id === id ? data : c));
      trackCampaignUpdated(data, changedFields);
      toast({
        title: "Success",
        description: "Campaign updated successfully"
      });
      return data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      const campaignToDelete = campaigns.find(c => c.id === id);
      
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCampaigns(prev => prev.filter(c => c.id !== id));
      if (campaignToDelete) {
        trackCampaignDeleted(campaignToDelete);
      }
      toast({
        title: "Success",
        description: "Campaign deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    refreshCampaigns: fetchCampaigns
  };
}
