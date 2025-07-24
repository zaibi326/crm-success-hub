
import { useComprehensiveActivityLogger } from './useComprehensiveActivityLogger';
import { TaxLead } from '@/types/taxLead';
import { useCallback } from 'react';

export function useComprehensiveLeadActivityTracker() {
  const { logLeadActivity } = useComprehensiveActivityLogger();

  const trackLeadCreated = useCallback((lead: TaxLead) => {
    if (!lead) return;
    
    logLeadActivity(
      'created',
      `Created new lead for ${lead.ownerName} at ${lead.propertyAddress}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        status: lead.status,
        temperature: lead.temperature,
        currentArrears: lead.currentArrears,
        createdAt: new Date().toISOString()
      }
    );
  }, [logLeadActivity]);

  const trackLeadUpdated = useCallback((lead: TaxLead, changedFields: string[], oldValues?: any) => {
    if (!lead) return;
    
    logLeadActivity(
      'updated',
      `Updated lead for ${lead.ownerName} - Modified: ${changedFields.join(', ')}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        changedFields,
        oldValues,
        newValues: changedFields.reduce((acc, field) => {
          acc[field] = lead[field as keyof TaxLead];
          return acc;
        }, {} as any),
        status: lead.status,
        temperature: lead.temperature,
        updatedAt: new Date().toISOString()
      }
    );
  }, [logLeadActivity]);

  const trackLeadDeleted = useCallback((lead: TaxLead) => {
    if (!lead) return;
    
    logLeadActivity(
      'deleted',
      `Deleted lead for ${lead.ownerName} at ${lead.propertyAddress}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        status: lead.status,
        temperature: lead.temperature,
        deletedAt: new Date().toISOString()
      }
    );
  }, [logLeadActivity]);

  const trackStatusChanged = useCallback((lead: TaxLead, oldStatus: string, newStatus: string) => {
    if (!lead) return;
    
    logLeadActivity(
      'status_changed',
      `Changed lead status from ${oldStatus} to ${newStatus} for ${lead.ownerName}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        oldStatus,
        newStatus,
        statusChangedAt: new Date().toISOString()
      }
    );
  }, [logLeadActivity]);

  const trackTemperatureChanged = useCallback((lead: TaxLead, oldTemp: string, newTemp: string) => {
    if (!lead) return;
    
    logLeadActivity(
      'temperature_changed',
      `Changed lead temperature from ${oldTemp} to ${newTemp} for ${lead.ownerName}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        oldTemperature: oldTemp,
        newTemperature: newTemp,
        temperatureChangedAt: new Date().toISOString()
      }
    );
  }, [logLeadActivity]);

  const trackAttachmentUploaded = useCallback((lead: TaxLead, fileName: string, fileType: string) => {
    if (!lead) return;
    
    logLeadActivity(
      'attachment_uploaded',
      `Uploaded attachment "${fileName}" to lead for ${lead.ownerName}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        fileName,
        fileType,
        uploadedAt: new Date().toISOString()
      }
    );
  }, [logLeadActivity]);

  const trackAttachmentDeleted = useCallback((lead: TaxLead, fileName: string) => {
    if (!lead) return;
    
    logLeadActivity(
      'attachment_deleted',
      `Deleted attachment "${fileName}" from lead for ${lead.ownerName}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        fileName,
        deletedAt: new Date().toISOString()
      }
    );
  }, [logLeadActivity]);

  const trackHeirDataModified = useCallback((lead: TaxLead, action: 'added' | 'updated' | 'deleted', heirData: any) => {
    if (!lead) return;
    
    logLeadActivity(
      'heir_data_modified',
      `${action.charAt(0).toUpperCase() + action.slice(1)} heir data for ${lead.ownerName} - ${heirData.name || 'Unknown Heir'}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        action,
        heirData,
        modifiedAt: new Date().toISOString()
      }
    );
  }, [logLeadActivity]);

  const trackBulkLeadsUpdated = useCallback((leads: TaxLead[], action: string) => {
    if (!leads || leads.length === 0) return;
    
    logLeadActivity(
      'bulk_updated',
      `${action} ${leads.length} leads in bulk operation`,
      undefined,
      {
        count: leads.length,
        action,
        leadIds: leads.map(lead => lead.id),
        bulkUpdatedAt: new Date().toISOString()
      }
    );
  }, [logLeadActivity]);

  const trackBulkLeadsDeleted = useCallback((leads: TaxLead[]) => {
    if (!leads || leads.length === 0) return;
    
    logLeadActivity(
      'bulk_deleted',
      `Deleted ${leads.length} leads in bulk operation`,
      undefined,
      {
        count: leads.length,
        deletedLeads: leads.map(lead => ({
          id: lead.id,
          ownerName: lead.ownerName,
          propertyAddress: lead.propertyAddress
        })),
        bulkDeletedAt: new Date().toISOString()
      }
    );
  }, [logLeadActivity]);

  const trackLeadViewed = useCallback((lead: TaxLead) => {
    if (!lead || !lead.ownerName) return;
    
    logLeadActivity(
      'viewed',
      `Viewed lead details for ${lead.ownerName}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        viewedAt: new Date().toISOString()
      }
    );
  }, [logLeadActivity]);

  const trackLeadNoteAdded = useCallback((lead: TaxLead, note: string) => {
    if (!lead || !note) return;
    
    logLeadActivity(
      'note_added',
      `Added note to lead for ${lead.ownerName}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        note: note.substring(0, 100) + (note.length > 100 ? '...' : ''),
        noteAddedAt: new Date().toISOString()
      }
    );
  }, [logLeadActivity]);

  return {
    trackLeadCreated,
    trackLeadUpdated,
    trackLeadDeleted,
    trackStatusChanged,
    trackTemperatureChanged,
    trackAttachmentUploaded,
    trackAttachmentDeleted,
    trackHeirDataModified,
    trackBulkLeadsUpdated,
    trackBulkLeadsDeleted,
    trackLeadViewed,
    trackLeadNoteAdded
  };
}
