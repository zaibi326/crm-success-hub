import { useComprehensiveActivityLogger } from './useComprehensiveActivityLogger';
import { useToast } from './use-toast';
import { TaxLead } from '@/types/taxLead';

/**
 * Enhanced hook for lead actions with comprehensive activity logging
 * Use this hook in lead components to automatically log all important actions
 */
export function useEnhancedLeadActions() {
  const {
    logLeadActivity,
    logLeadStatusChange,
    logLeadDispositionChange,
    logDocumentUpload,
    logHeirAddition,
    logLeadFieldUpdate,
    logLeadNote,
    isLogging
  } = useComprehensiveActivityLogger();
  const { toast } = useToast();

  const handleLeadCreate = async (lead: TaxLead) => {
    logLeadActivity(
      'created',
      `Created new lead for ${lead.ownerName}`,
      lead.id.toString(),
      {
        leadName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        taxId: lead.taxId,
        status: lead.status
      }
    );
    
    toast({
      title: "Lead Created",
      description: `Successfully created lead for ${lead.ownerName}`
    });
  };

  const handleLeadUpdate = async (lead: TaxLead, updatedFields: Partial<TaxLead>) => {
    const changes = Object.entries(updatedFields)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    logLeadActivity(
      'updated',
      `Updated lead for ${lead.ownerName} - Changed: ${changes}`,
      lead.id.toString(),
      {
        leadName: lead.ownerName,
        updatedFields,
        changeCount: Object.keys(updatedFields).length
      }
    );
  };

  const handleFieldUpdate = async (
    lead: TaxLead, 
    fieldName: keyof TaxLead, 
    oldValue: any, 
    newValue: any
  ) => {
    logLeadFieldUpdate(
      lead.id.toString(),
      lead.ownerName || 'Unknown',
      String(fieldName),
      String(oldValue || ''),
      String(newValue || ''),
      {
        fieldType: typeof newValue,
        leadId: lead.id
      }
    );
  };

  const handleStatusChange = async (
    lead: TaxLead, 
    oldStatus: string, 
    newStatus: string
  ) => {
    logLeadStatusChange(
      lead.id.toString(),
      lead.ownerName || 'Unknown',
      oldStatus,
      newStatus,
      {
        propertyAddress: lead.propertyAddress,
        taxId: lead.taxId
      }
    );

    toast({
      title: "Status Updated",
      description: `Lead status changed from ${oldStatus} to ${newStatus}`
    });
  };

  const handleDispositionChange = async (
    lead: TaxLead, 
    disposition: 'keep' | 'pass', 
    reason?: string
  ) => {
    logLeadDispositionChange(
      lead.id.toString(),
      lead.ownerName || 'Unknown',
      disposition,
      reason,
      {
        propertyAddress: lead.propertyAddress,
        taxId: lead.taxId,
        previousStatus: lead.status
      }
    );

    toast({
      title: `Lead ${disposition.toUpperCase()}`,
      description: `Successfully marked lead as ${disposition.toUpperCase()}${reason ? ` - ${reason}` : ''}`,
      variant: disposition === 'keep' ? 'default' : 'destructive'
    });
  };

  const handleDocumentUpload = async (
    lead: TaxLead, 
    fileName: string, 
    fileType: string,
    fileSize?: number
  ) => {
    logDocumentUpload(
      lead.id.toString(),
      lead.ownerName || 'Unknown',
      fileName,
      fileType,
      {
        fileSize,
        uploadTime: new Date().toISOString(),
        propertyAddress: lead.propertyAddress
      }
    );

    toast({
      title: "Document Uploaded",
      description: `Successfully uploaded ${fileName}`
    });
  };

  const handleHeirAddition = async (
    lead: TaxLead, 
    heirName: string, 
    relationship?: string,
    contactInfo?: { phone?: string; email?: string }
  ) => {
    logHeirAddition(
      lead.id.toString(),
      lead.ownerName || 'Unknown',
      heirName,
      relationship,
      {
        contactInfo,
        addedTime: new Date().toISOString(),
        propertyAddress: lead.propertyAddress
      }
    );

    toast({
      title: "Heir Added",
      description: `Successfully added heir ${heirName}${relationship ? ` (${relationship})` : ''}`
    });
  };

  const handleNoteAddition = async (
    lead: TaxLead, 
    noteContent: string,
    noteType?: 'general' | 'call' | 'meeting' | 'follow-up'
  ) => {
    logLeadNote(
      lead.id.toString(),
      lead.ownerName || 'Unknown',
      noteContent,
      {
        noteType: noteType || 'general',
        noteLength: noteContent.length,
        timestamp: new Date().toISOString()
      }
    );

    toast({
      title: "Note Added",
      description: "Successfully added note to lead"
    });
  };

  const handleCommunication = async (
    lead: TaxLead,
    type: 'call' | 'sms' | 'email',
    target: string,
    duration?: number,
    notes?: string
  ) => {
    const actionTypes = {
      call: 'call',
      sms: 'sms', 
      email: 'email'
    };

    const descriptions = {
      call: `Made phone call to ${target}${duration ? ` (${duration}min)` : ''}`,
      sms: `Sent SMS to ${target}`,
      email: `Sent email to ${target}`
    };

    logLeadActivity(
      actionTypes[type],
      `${descriptions[type]} for ${lead.ownerName || 'Unknown'}${notes ? ` - ${notes}` : ''}`,
      lead.id.toString(),
      {
        leadName: lead.ownerName,
        communicationType: type,
        target,
        duration,
        notes,
        timestamp: new Date().toISOString()
      }
    );
  };

  const handleLeadView = async (lead: TaxLead) => {
    logLeadActivity(
      'viewed',
      `Viewed lead details for ${lead.ownerName || 'Unknown'}`,
      lead.id.toString(),
      {
        leadName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        status: lead.status,
        viewTime: new Date().toISOString()
      }
    );
  };

  const handleLeadDelete = async (lead: TaxLead, reason?: string) => {
    logLeadActivity(
      'deleted',
      `Deleted lead for ${lead.ownerName || 'Unknown'}${reason ? ` - Reason: ${reason}` : ''}`,
      lead.id.toString(),
      {
        leadName: lead.ownerName,
        propertyAddress: lead.propertyAddress,
        reason,
        deletedTime: new Date().toISOString()
      }
    );
  };

  return {
    handleLeadCreate,
    handleLeadUpdate,
    handleFieldUpdate,
    handleStatusChange,
    handleDispositionChange,
    handleDocumentUpload,
    handleHeirAddition,
    handleNoteAddition,
    handleCommunication,
    handleLeadView,
    handleLeadDelete,
    isLogging
  };
}