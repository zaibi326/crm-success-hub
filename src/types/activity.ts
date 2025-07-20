
export interface ActivityItem {
  id: number;
  type: 'created' | 'note' | 'status_change' | 'field_update' | 'file_upload' | 'comment' | 'call' | 'email' | 'sms';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  userInitials?: string;
  mentions?: string[];
  oldValue?: string;
  newValue?: string;
  fieldName?: string;
}
