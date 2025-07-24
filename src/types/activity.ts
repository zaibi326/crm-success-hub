
export interface ActivityItem {
  id: number;
  type: 'created' | 'updated' | 'deleted' | 'viewed' | 'note_added' | 'status_changed' | 'temperature_changed' | 'attachment_uploaded' | 'attachment_deleted' | 'heir_data_modified' | 'bulk_updated' | 'bulk_deleted' | 'field_update' | 'file_upload' | 'comment' | 'call' | 'email' | 'sms';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  userInitials?: string;
  mentions?: string[];
  oldValue?: string;
  newValue?: string;
  fieldName?: string;
  leadId?: string;
  ownerName?: string;
  propertyAddress?: string;
  changedFields?: string[];
  metadata?: {
    action?: string;
    fileName?: string;
    fileType?: string;
    heirData?: any;
    count?: number;
    leadIds?: number[];
    oldStatus?: string;
    newStatus?: string;
    oldTemperature?: string;
    newTemperature?: string;
    note?: string;
    [key: string]: any;
  };
}
