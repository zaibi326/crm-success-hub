
import { useComprehensiveActivityLogger } from './useComprehensiveActivityLogger';
import { TaxLead } from '@/types/taxLead';

export function useLeadActivityTracking() {
  const { logLeadActivity } = useComprehensiveActivityLogger();

  const trackLeadCreated = (lead: TaxLead) => {
    logLeadActivity(
      'created',
      `Created new lead for ${lead.ownerName} at ${lead.propertyAddress}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        status: lead.status,
        currentArrears: lead.currentArrears
      }
    );
  };

  const trackLeadUpdated = (lead: TaxLead, changedFields: string[]) => {
    logLeadActivity(
      'updated',
      `Updated lead for ${lead.ownerName} - Modified: ${changedFields.join(', ')}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        changedFields,
        status: lead.status
      }
    );
  };

  const trackLeadDeleted = (lead: TaxLead) => {
    logLeadActivity(
      'deleted',
      `Deleted lead for ${lead.ownerName} at ${lead.propertyAddress}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        deletedStatus: lead.status
      }
    );
  };

  const trackStatusChanged = (lead: TaxLead, oldStatus: string, newStatus: string) => {
    logLeadActivity(
      'status_change',
      `Changed lead status from ${oldStatus} to ${newStatus} for ${lead.ownerName}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        oldStatus,
        newStatus
      }
    );
  };

  const trackAttachmentUploaded = (lead: TaxLead, fileName: string) => {
    logLeadActivity(
      'file_upload',
      `Uploaded attachment "${fileName}" to lead for ${lead.ownerName}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        fileName
      }
    );
  };

  const trackAttachmentDeleted = (lead: TaxLead, fileName: string) => {
    logLeadActivity(
      'file_delete',
      `Deleted attachment "${fileName}" from lead for ${lead.ownerName}`,
      lead.id.toString(),
      {
        ownerName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        fileName
      }
    );
  };

  const trackBulkLeadsUpdated = (count: number, action: string) => {
    logLeadActivity(
      'bulk_updated',
      `${action} ${count} leads in bulk operation`,
      undefined,
      {
        count,
        action
      }
    );
  };

  const trackBulkLeadsDeleted = (count: number) => {
    logLeadActivity(
      'bulk_deleted',
      `Deleted ${count} leads in bulk operation`,
      undefined,
      {
        count
      }
    );
  };

  return {
    trackLeadCreated,
    trackLeadUpdated,
    trackLeadDeleted,
    trackStatusChanged,
    trackAttachmentUploaded,
    trackAttachmentDeleted,
    trackBulkLeadsUpdated,
    trackBulkLeadsDeleted
  };
}
