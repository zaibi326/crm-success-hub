import { useState, useEffect } from 'react';
import { TaxLead } from '@/types/taxLead';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateLeadData } from '@/utils/validation';
import { z } from 'zod';

export function useLeadsData() {
  const [mockLeads, setMockLeads] = useState<TaxLead[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  // Load leads from Supabase on component mount
  useEffect(() => {
    loadLeadsFromDatabase();
  }, []);

  const loadLeadsFromDatabase = async () => {
    try {
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

      // Fetch all user profiles at once for mapping IDs to names
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email');

      if (profilesError) {
        console.error('Error loading user profiles:', profilesError);
      }

      // Create a map of user IDs to display names
      const userMap = new Map<string, string>();
      profiles?.forEach(profile => {
        const displayName = profile.first_name && profile.last_name
          ? `${profile.first_name} ${profile.last_name}`.trim()
          : profile.email;
        userMap.set(profile.id, displayName);
      });

      const leadsData = data?.map((lead) => {
        // Split owner_name into firstName and lastName
        const nameParts = lead.owner_name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Create a stable numeric ID from the Supabase UUID
        const stableNumericId = lead.id ? 
          Math.abs(lead.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 2147483647 : 
          Math.floor(Math.random() * 1000000);

        // Get actual user names from their IDs
        const createdByName = lead.created_by ? userMap.get(lead.created_by) || 'Unknown User' : 'Unknown User';
        const leadManagerName = lead.lead_manager ? userMap.get(lead.lead_manager) || undefined : undefined;

        return {
          id: stableNumericId, // Use stable numeric ID derived from Supabase UUID
          taxId: lead.tax_id || '',
          ownerName: lead.owner_name,
          propertyAddress: lead.property_address,
          createdBy: lead.created_by, // Store UUID for filtering
          leadManager: lead.lead_manager, // Store UUID for filtering
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
          
          // Attached files and heirs from JSONB columns
          attachedFiles: (() => {
            try {
              const files = lead.attached_files;
              if (Array.isArray(files)) {
                return files;
              }
              if (typeof files === 'string') {
                const parsed = JSON.parse(files);
                return Array.isArray(parsed) ? parsed : [];
              }
              return [];
            } catch (error) {
              console.warn('Error parsing attached_files:', error);
              return [];
            }
          })(),
          heirs: (() => {
            try {
              const heirs = lead.heirs;
              if (Array.isArray(heirs)) {
                return heirs;
              }
              if (typeof heirs === 'string') {
                const parsed = JSON.parse(heirs);
                return Array.isArray(parsed) ? parsed : [];
              }
              return [];
            } catch (error) {
              console.warn('Error parsing heirs:', error);
              return [];
            }
          })(),
          
          // Additional Information Fields
          hasDeath: lead.has_death || false,
          deathNotes: lead.death_notes || '',
          hasProbate: lead.has_probate || false,
          probateNotes: lead.probate_notes || '',
          hasLawsuit: lead.has_lawsuit || false,
          lawsuitNotes: lead.lawsuit_notes || '',
          hasAdditionalTaxingEntities: lead.has_additional_taxing_entities || false,
          additionalTaxingNotes: lead.additional_taxing_notes || '',
          
          // Conditional Fields
          vestingDeedDate: lead.vesting_deed_date || '',
          grantorGranteeName: lead.grantor_grantee_name || '',
          ownerOfRecord: lead.owner_of_record || '',
          
          supabaseId: lead.id // Store the actual Supabase ID for operations
        } as TaxLead & { supabaseId: string };
      }) || [];

      setMockLeads(leadsData);
      console.log('Loaded leads from database:', leadsData.length, 'leads');
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

  const handleAddLead = async (newLead: TaxLead) => {
    try {
      // Validate input data before processing
      try {
        validateLeadData(newLead);
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast({
            title: "Validation Error",
            description: error.errors[0].message,
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

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

      // Get user profile for creator info
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', user.id)
        .single();

      const createdByName = profile 
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
        : user.email || 'Unknown User';

      // Insert the new lead
      const { data, error } = await supabase
        .from('campaign_leads')
        .insert({
          campaign_id: campaignId,
          tax_id: newLead.taxId,
          owner_name: newLead.ownerName,
          property_address: newLead.propertyAddress,
          tax_lawsuit_number: newLead.taxLawsuitNumber,
          current_arrears: newLead.currentArrears,
          status: newLead.status,
          notes: newLead.notes,
          phone: newLead.phone,
          email: newLead.email,
          disposition: newLead.disposition || 'UNDECIDED',
          
          // Store actual user IDs for filtering
          created_by: user.id,
          lead_manager: newLead.leadManager || user.id,
          
          // New JSONB fields
          attached_files: JSON.stringify((newLead as any).attachedFiles || []),
          heirs: JSON.stringify((newLead as any).heirs || []),
          
          // Additional information fields
          has_death: newLead.hasDeath || false,
          death_notes: newLead.deathNotes || '',
          has_probate: newLead.hasProbate || false,
          probate_notes: newLead.probateNotes || '',
          has_lawsuit: newLead.hasLawsuit || false,
          lawsuit_notes: newLead.lawsuitNotes || '',
          has_additional_taxing_entities: newLead.hasAdditionalTaxingEntities || false,
          additional_taxing_notes: newLead.additionalTaxingNotes || '',
          
          // Conditional fields
          vesting_deed_date: newLead.vestingDeedDate || '',
          grantor_grantee_name: newLead.grantorGranteeName || '',
          owner_of_record: newLead.ownerOfRecord || ''
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
        title: "Success",
        description: "Lead successfully added",
      });

      // Reload leads from database
      await loadLeadsFromDatabase();
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
      // Validate input data before processing
      try {
        validateLeadData(updatedLead);
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast({
            title: "Validation Error",
            description: error.errors[0].message,
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

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
        attachedFiles: (updatedLead as any).attachedFiles,
        attachedFilesType: typeof (updatedLead as any).attachedFiles,
        attachedFilesLength: (updatedLead as any).attachedFiles?.length
      });

      // New JSONB fields
      const attachedFilesToSave = (updatedLead as any).attachedFiles || [];
      const heirsToSave = (updatedLead as any).heirs || [];
      
      console.log('Preparing to save to DB:', {
        attachedFiles: attachedFilesToSave,
        attachedFilesStringified: JSON.stringify(attachedFilesToSave),
        heirs: heirsToSave,
        heirsStringified: JSON.stringify(heirsToSave)
      });

      // Update the lead in the database
      const { error } = await supabase
        .from('campaign_leads')
        .update({
          tax_id: updatedLead.taxId,
          owner_name: updatedLead.ownerName,
          property_address: updatedLead.propertyAddress,
          tax_lawsuit_number: updatedLead.taxLawsuitNumber,
          current_arrears: updatedLead.currentArrears,
          status: updatedLead.status,
          notes: updatedLead.notes,
          phone: updatedLead.phone,
          email: updatedLead.email,
          disposition: updatedLead.disposition || 'UNDECIDED',
          
          // Update lead manager if changed
          lead_manager: updatedLead.leadManager || null,
          
          // New JSONB fields
          attached_files: JSON.stringify(attachedFilesToSave),
          heirs: JSON.stringify(heirsToSave),
          
          // Additional information fields
          has_death: updatedLead.hasDeath,
          death_notes: updatedLead.deathNotes,
          has_probate: updatedLead.hasProbate,
          probate_notes: updatedLead.probateNotes,
          has_lawsuit: updatedLead.hasLawsuit,
          lawsuit_notes: updatedLead.lawsuitNotes,
          has_additional_taxing_entities: updatedLead.hasAdditionalTaxingEntities,
          additional_taxing_notes: updatedLead.additionalTaxingNotes,
          
          // Conditional fields
          vesting_deed_date: updatedLead.vestingDeedDate,
          grantor_grantee_name: updatedLead.grantorGranteeName,
          owner_of_record: updatedLead.ownerOfRecord,
          
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

      console.log('Lead updated successfully in database');
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
    loadLeadsFromDatabase
  };
}