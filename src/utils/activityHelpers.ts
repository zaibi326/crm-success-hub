// Utility functions for enhanced activity descriptions and formatting

export const getActivityTitle = (actionType: string, module: string): string => {
  switch (module) {
    case 'leads':
      switch (actionType) {
        case 'created': return 'Lead Created';
        case 'updated': return 'Lead Updated';
        case 'field_updated': return 'Field Updated';
        case 'deleted': return 'Lead Deleted';
        case 'bulk_deleted': return 'Leads Deleted';
        case 'status_change': return 'Status Changed';
        case 'keep_lead': return 'Lead Kept';
        case 'pass_lead': return 'Lead Passed';
        case 'document_upload': return 'Document Uploaded';
        case 'heir_added': return 'Heir Added';
        case 'note_added': return 'Note Added';
        case 'comment': return 'Comment Added';
        case 'viewed': return 'Lead Viewed';
        case 'call': return 'Phone Call';
        case 'sms': return 'SMS Sent';
        case 'email': return 'Email Sent';
        default: return 'Lead Activity';
      }
    case 'campaigns':
      switch (actionType) {
        case 'created': return 'Campaign Created';
        case 'updated': return 'Campaign Updated';
        case 'deleted': return 'Campaign Deleted';
        case 'lead_import': return 'Leads Imported';
        default: return 'Campaign Activity';
      }
    case 'communication':
      switch (actionType) {
        case 'call': return 'Phone Call';
        case 'sms': return 'SMS Sent';
        case 'email': return 'Email Sent';
        default: return 'Communication';
      }
    case 'auth':
      switch (actionType) {
        case 'login': return 'User Login';
        case 'logout': return 'User Logout';
        case 'registered': return 'User Registered';
        default: return 'Authentication';
      }
    case 'system':
      switch (actionType) {
        case 'reset_logs': return 'Logs Reset';
        default: return 'System Activity';
      }
    default:
      return actionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

export const formatActivityDescription = (activity: any): string => {
  // If we already have a good description, use it
  if (activity.description && activity.description.length > 10) {
    return activity.description;
  }

  // Generate better descriptions based on activity type and metadata
  const { action_type, module, metadata } = activity;
  
  switch (module) {
    case 'leads':
      switch (action_type) {
        case 'created':
          return `Created new lead${metadata?.leadName ? ` for ${metadata.leadName}` : ''}`;
        case 'status_change':
          return `Changed status${metadata?.oldStatus && metadata?.newStatus ? ` from ${metadata.oldStatus} to ${metadata.newStatus}` : ''}${metadata?.leadName ? ` for ${metadata.leadName}` : ''}`;
        case 'keep_lead':
          return `Marked lead as KEEP${metadata?.leadName ? ` for ${metadata.leadName}` : ''}${metadata?.reason ? ` - ${metadata.reason}` : ''}`;
        case 'pass_lead':
          return `Marked lead as PASS${metadata?.leadName ? ` for ${metadata.leadName}` : ''}${metadata?.reason ? ` - ${metadata.reason}` : ''}`;
        case 'document_upload':
          return `Uploaded document${metadata?.fileName ? ` "${metadata.fileName}"` : ''}${metadata?.leadName ? ` for ${metadata.leadName}` : ''}`;
        case 'heir_added':
          return `Added heir${metadata?.heirName ? ` "${metadata.heirName}"` : ''}${metadata?.relationship ? ` (${metadata.relationship})` : ''}${metadata?.leadName ? ` to ${metadata.leadName}` : ''}`;
        case 'field_updated':
          return `Updated ${metadata?.fieldName || 'field'}${metadata?.oldValue && metadata?.newValue ? ` from "${metadata.oldValue}" to "${metadata.newValue}"` : ''}${metadata?.leadName ? ` for ${metadata.leadName}` : ''}`;
        case 'bulk_deleted':
          return `Deleted ${metadata?.count || 'multiple'} lead(s) in bulk operation${metadata?.deletedLeads && metadata.deletedLeads[0]?.ownerName ? ` including ${metadata.deletedLeads[0].ownerName}` : ''}`;
        default:
          return activity.description || `Performed ${action_type} action`;
      }
    default:
      return activity.description || `Performed ${action_type} in ${module}`;
  }
};

export const getActivityPriority = (actionType: string, module: string): number => {
  // Higher numbers = higher priority in the feed
  switch (module) {
    case 'leads':
      switch (actionType) {
        case 'keep_lead':
        case 'pass_lead':
          return 10; // Highest priority
        case 'created':
        case 'deleted':
        case 'bulk_deleted':
          return 9;
        case 'status_change':
          return 8;
        case 'document_upload':
        case 'heir_added':
          return 7;
        case 'call':
        case 'sms':
        case 'email':
          return 6;
        case 'note_added':
        case 'comment':
          return 5;
        case 'field_updated':
        case 'updated':
          return 4;
        case 'viewed':
          return 2; // Lower priority
        default:
          return 3;
      }
    case 'campaigns':
      return 6;
    case 'system':
      return 8;
    default:
      return 3;
  }
};

export const shouldShowInFeed = (activity: any): boolean => {
  // Filter out low-priority activities or spam
  const { action_type, module, created_at } = activity;
  
  // Don't show too many "viewed" activities
  if (action_type === 'viewed') {
    const activityTime = new Date(created_at);
    const now = new Date();
    const diffMinutes = (now.getTime() - activityTime.getTime()) / (1000 * 60);
    // Only show recent views (within 10 minutes)
    return diffMinutes <= 10;
  }
  
  return true;
};