import { useState, useEffect } from 'react';
import { TaxLead } from '@/types/taxLead';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useLeadsData() {
  const [mockLeads, setMockLeads] = useState<TaxLead[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { toast } = useToast();

  // Load leads from Supabase on component mount and when refetch is triggered
  useEffect(() => {
    loadLeadsFromDatabase();
  }, [refetchTrigger]);

  const loadLeadsFromDatabase = async () => {
    try {
      console.log('Loading leads from database...');
      const { data, error } = await supabase
        .from('campaign_leads')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading leads:', error);
        toast({
          title: "Error",
          description: "Failed to load leads from database",
          variant: "destructive",
        });
        return;
      }

      const leadsData = data?.map((lead, index) => {
        // Split owner_name into firstName and lastName
        const nameParts = lead.owner_name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        return {
          id: index + 1, // Use index + 1 for numeric ID as expected by TaxLead interface
          taxId: lead.tax_id || '',
          ownerName: lead.owner_name,
          propertyAddress: lead.property_address,
          sellerPropertyAddress: lead.property_address, // Use property_address as fallback
          taxLawsuitNumber: lead.tax_lawsuit_number || '',
          currentArrears: lead.current_arrears || 0,
          status: (lead.status || 'COLD') as 'HOT' | 'WARM' | 'COLD' | 'PASS' | 'KEEP',
          notes: lead.notes || '',
          phone: lead.phone || '',
          email: lead.email || '',
          firstName,
          lastName,
          temperature: (lead.status || 'COLD') as 'HOT' | 'WARM' | 'COLD',
          occupancyStatus: 'VACANT' as const,
          disposition: (lead.disposition as 'UNDECIDED' | 'QUALIFIED' | 'DISQUALIFIED') || 'UNDECIDED',
          createdAt: lead.created_at,
          updatedAt: lead.updated_at,
          supabaseId: lead.id // Store the actual Supabase ID for operations
        } as TaxLead & { supabaseId: string };
      }) || [];

      setMockLeads(leadsData);
      console.log('Successfully loaded leads from database:', leadsData.length, 'leads');
    } catch (error) {
      console.error('Error in loadLeadsFromDatabase:', error);
      toast({
        title: "Error",
        description: "Failed to load leads",
        variant: "destructive",
      });
    } finally {
      setIsLoaded(true);
    }
  };

  // Force refetch function to ensure fresh data
  const refetch = async () => {
    console.log('Force refetching leads...');
    setRefetchTrigger(prev => prev + 1);
  };

  const handleAddLead = async (newLead: TaxLead) => {
    try {
      // First get or create a campaign for this user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to add leads",
          variant: "destructive",
        });
        return;
      }

      // Check if user has any campaigns, create one if not
      let { data: campaigns } = await supabase
        .from('campaigns')
        .select('id')
        .eq('created_by', user.id)
        .limit(1);

      let campaignId: string;

      if (!campaigns || campaigns.length === 0) {
        // Create a default campaign
        const { data: newCampaign, error: campaignError } = await supabase
          .from('campaigns')
          .insert({
            name: 'Default Campaign',
            description: 'Auto-created campaign for leads',
            start_date: new Date().toISOString().split('T')[0],
            created_by: user.id
          })
          .select('id')
          .single();

        if (campaignError) {
          console.error('Error creating campaign:', campaignError);
          toast({
            title: "Error",
            description: "Failed to create campaign for lead",
            variant: "destructive",
          });
          return;
        }
        campaignId = newCampaign.id;
      } else {
        campaignId = campaigns[0].id;
      }

      // Insert the new lead
      const { data, error } = await supabase
        .from('campaign_leads')
        .insert({
          campaign_id: campaignId,
          tax_id: newLead.taxId,
          owner_name: newLead.ownerName,
          property_address: newLead.propertyAddress,
          seller_property_address: newLead.sellerPropertyAddress,
          tax_lawsuit_number: newLead.taxLawsuitNumber,
          current_arrears: newLead.currentArrears,
          status: newLead.status,
          notes: newLead.notes,
          phone: newLead.phone,
          email: newLead.email,
          disposition: newLead.disposition || 'UNDECIDED'
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding lead:', error);
        toast({
          title: "Error",
          description: "Failed to add lead to database",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "✅ Success",
        description: "Lead successfully added and saved",
      });

      // Force reload leads from database to get fresh data
      await refetch();
    } catch (error) {
      console.error('Error in handleAddLead:', error);
      toast({
        title: "Error",
        description: "Failed to add lead",
        variant: "destructive",
      });
    }
  };

  const handleLeadUpdate = async (updatedLead: TaxLead) => {
    try {
      const leadWithSupabaseId = updatedLead as TaxLead & { supabaseId: string };
      
      if (!leadWithSupabaseId.supabaseId) {
        console.error('No Supabase ID found for lead update');
        toast({
          title: "Error",
          description: "Cannot update lead - missing database ID",
          variant: "destructive",
        });
        return;
      }

      console.log('Updating lead with data:', {
        id: leadWithSupabaseId.supabaseId,
        status: updatedLead.status,
        disposition: updatedLead.disposition,
        notes: updatedLead.notes,
        phone: updatedLead.phone,
        email: updatedLead.email,
        firstName: updatedLead.firstName,
        lastName: updatedLead.lastName,
        sellerPropertyAddress: updatedLead.sellerPropertyAddress
      });

      // Update the lead in the database
      const { error } = await supabase
        .from('campaign_leads')
        .update({
          tax_id: updatedLead.taxId,
          owner_name: updatedLead.ownerName,
          property_address: updatedLead.propertyAddress,
          seller_property_address: updatedLead.sellerPropertyAddress,
          tax_lawsuit_number: updatedLead.taxLawsuitNumber,
          current_arrears: updatedLead.currentArrears,
          status: updatedLead.status,
          notes: updatedLead.notes,
          phone: updatedLead.phone,
          email: updatedLead.email,
          disposition: updatedLead.disposition || 'UNDECIDED',
          updated_at: new Date().toISOString()
        })
        .eq('id', leadWithSupabaseId.supabaseId);

      if (error) {
        console.error('Error updating lead:', error);
        toast({
          title: "Error",
          description: "Failed to update lead in database",
          variant: "destructive",
        });
        throw error;
      }

      // Update local state immediately to show changes
      setMockLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === updatedLead.id ? { ...updatedLead, supabaseId: leadWithSupabaseId.supabaseId } : lead
        )
      );

      // Show success toast
      toast({
        title: "✅ Changes Saved Successfully",
        description: "Lead has been updated and saved to database",
      });

      console.log('Lead updated successfully in database');

      // Force refetch to ensure we have the latest data
      setTimeout(() => {
        refetch();
      }, 500);
      
    } catch (error) {
      console.error('Error in handleLeadUpdate:', error);
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteLead = async (leadId: number) => {
    try {
      // Find the lead with the matching ID
      const leadToDelete = mockLeads.find(lead => lead.id === leadId) as TaxLead & { supabaseId: string };
      
      if (!leadToDelete || !leadToDelete.supabaseId) {
        console.error('Lead not found or missing Supabase ID');
        toast({
          title: "Error",
          description: "Cannot delete lead - not found in database",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('campaign_leads')
        .delete()
        .eq('id', leadToDelete.supabaseId);

      if (error) {
        console.error('Error deleting lead:', error);
        toast({
          title: "Error",
          description: "Failed to delete lead from database",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Lead successfully deleted",
      });

      // Reload leads from database
      await loadLeadsFromDatabase();
    } catch (error) {
      console.error('Error in handleDeleteLead:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
    }
  };

  const handleBulkDeleteLeads = async (leadIds: number[]) => {
    try {
      // Find the leads with matching IDs and get their Supabase IDs
      const leadsToDelete = mockLeads.filter(lead => leadIds.includes(lead.id)) as (TaxLead & { supabaseId: string })[];
      const supabaseIds = leadsToDelete.map(lead => lead.supabaseId).filter(Boolean);
      
      if (supabaseIds.length === 0) {
        console.error('No valid Supabase IDs found for bulk delete');
        toast({
          title: "Error",
          description: "Cannot delete leads - not found in database",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('campaign_leads')
        .delete()
        .in('id', supabaseIds);

      if (error) {
        console.error('Error bulk deleting leads:', error);
        toast({
          title: "Error",
          description: "Failed to delete leads from database",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Successfully deleted ${supabaseIds.length} leads`,
      });

      // Reload leads from database
      await loadLeadsFromDatabase();
    } catch (error) {
      console.error('Error in handleBulkDeleteLeads:', error);
      toast({
        title: "Error",
        description: "Failed to delete leads",
        variant: "destructive",
      });
    }
  };

  return {
    mockLeads,
    setMockLeads,
    handleAddLead,
    handleLeadUpdate,
    handleDeleteLead,
    handleBulkDeleteLeads,
    isLoaded,
    refetch
  };
}
