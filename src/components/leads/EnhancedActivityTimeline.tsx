
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  FileText, 
  User, 
  Upload, 
  Edit, 
  MessageSquare,
  Send,
  AtSign,
  Plus,
  TrendingUp,
  Clock,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TaxLead } from '@/types/taxLead';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: number;
  type: 'created' | 'note' | 'status_change' | 'field_update' | 'file_upload' | 'comment' | 'disposition' | 'email_sent' | 'call_made';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  userInitials: string;
  mentions?: string[];
  oldValue?: string;
  newValue?: string;
  fieldName?: string;
  metadata?: any;
}

interface EnhancedActivityTimelineProps {
  lead: TaxLead;
  readOnly?: boolean;
}

export function EnhancedActivityTimeline({ lead, readOnly = false }: EnhancedActivityTimelineProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [newComment, setNewComment] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Generate comprehensive activity history
  useEffect(() => {
    const generateActivities = (): ActivityItem[] => {
      const baseActivities: ActivityItem[] = [
        {
          id: 1,
          type: 'created',
          title: 'Lead Created',
          description: `Lead for ${lead.ownerName} was imported from campaign data`,
          timestamp: new Date(lead.createdAt || Date.now() - 7 * 24 * 60 * 60 * 1000),
          user: 'System',
          userInitials: 'SY'
        }
      ];

      // Add field update activities based on lead data
      let activityId = 2;

      if (lead.status !== 'COLD') {
        baseActivities.push({
          id: activityId++,
          type: 'status_change',
          title: 'Status Updated',
          description: `Lead status changed to ${lead.status}`,
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          user: 'John Doe',
          userInitials: 'JD',
          oldValue: 'COLD',
          newValue: lead.status,
          fieldName: 'status'
        });
      }

      if (lead.currentArrears && lead.currentArrears > 0) {
        baseActivities.push({
          id: activityId++,
          type: 'field_update',
          title: 'Arrears Amount Updated',
          description: `Current arrears updated to $${lead.currentArrears.toLocaleString()}`,
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          user: 'Jane Smith',
          userInitials: 'JS',
          oldValue: '$0',
          newValue: `$${lead.currentArrears.toLocaleString()}`,
          fieldName: 'currentArrears'
        });
      }

      if (lead.email) {
        baseActivities.push({
          id: activityId++,
          type: 'field_update',
          title: 'Contact Information Updated',
          description: `Email address added: ${lead.email}`,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          user: 'Mike Johnson',
          userInitials: 'MJ',
          newValue: lead.email,
          fieldName: 'email'
        });
      }

      if (lead.phone) {
        baseActivities.push({
          id: activityId++,
          type: 'field_update',
          title: 'Phone Number Added',
          description: `Phone number updated: ${lead.phone}`,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          user: 'Mike Johnson',
          userInitials: 'MJ',
          newValue: lead.phone,
          fieldName: 'phone'
        });
      }

      if (lead.disposition) {
        baseActivities.push({
          id: activityId++,
          type: 'disposition',
          title: 'Disposition Set',
          description: `Lead marked as "${lead.disposition}" for further processing`,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          user: 'Sarah Wilson',
          userInitials: 'SW',
          newValue: lead.disposition,
          fieldName: 'disposition'
        });
      }

      if (lead.attachedFiles && lead.attachedFiles.length > 0) {
        lead.attachedFiles.forEach((file, index) => {
          baseActivities.push({
            id: activityId++,
            type: 'file_upload',
            title: 'Document Uploaded',
            description: `Added ${file.name} to the lead`,
            timestamp: new Date(file.uploadedAt || Date.now() - (1 + index) * 24 * 60 * 60 * 1000),
            user: 'Document Manager',
            userInitials: 'DM',
            metadata: { fileName: file.name, fileSize: file.size }
          });
        });
      }

      if (lead.notes) {
        baseActivities.push({
          id: activityId++,
          type: 'note',
          title: 'Note Added',
          description: lead.notes,
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          user: 'Current User',
          userInitials: 'CU'
        });
      }

      // Add some sample communication activities
      if (lead.email && lead.status === 'HOT') {
        baseActivities.push({
          id: activityId++,
          type: 'email_sent',
          title: 'Email Sent',
          description: `Initial contact email sent to ${lead.email}`,
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          user: 'Sales Team',
          userInitials: 'ST'
        });
      }

      if (lead.phone && lead.status !== 'PASS') {
        baseActivities.push({
          id: activityId++,
          type: 'call_made',
          title: 'Call Attempted',
          description: `Phone call made to ${lead.phone} - Left voicemail`,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          user: 'Sales Team',
          userInitials: 'ST'
        });
      }

      // Sort by timestamp (newest first)
      return baseActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    setActivities(generateActivities());
    setIsLoading(false);
  }, [lead]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newActivity: ActivityItem = {
      id: activities.length + 100,
      type: 'comment',
      title: 'Comment Added',
      description: newComment,
      timestamp: new Date(),
      user: 'Current User',
      userInitials: 'CU',
      mentions: newComment.match(/@\w+/g) || []
    };

    setActivities(prev => [newActivity, ...prev]);
    setNewComment('');

    toast({
      title: "Comment Added",
      description: "Your comment has been added to the activity timeline",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created': return <Plus className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      case 'status_change': return <TrendingUp className="w-4 h-4" />;
      case 'field_update': return <Edit className="w-4 h-4" />;
      case 'file_upload': return <Upload className="w-4 h-4" />;
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      case 'disposition': return <Activity className="w-4 h-4" />;
      case 'email_sent': return <Send className="w-4 h-4" />;
      case 'call_made': return <User className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'created': return 'bg-green-100 text-green-600';
      case 'note': return 'bg-blue-100 text-blue-600';
      case 'status_change': return 'bg-purple-100 text-purple-600';
      case 'field_update': return 'bg-orange-100 text-orange-600';
      case 'file_upload': return 'bg-indigo-100 text-indigo-600';
      case 'comment': return 'bg-gray-100 text-gray-600';
      case 'disposition': return 'bg-teal-100 text-teal-600';
      case 'email_sent': return 'bg-cyan-100 text-cyan-600';
      case 'call_made': return 'bg-pink-100 text-pink-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredActivities = filterType === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filterType);

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'created', label: 'Created' },
    { value: 'field_update', label: 'Field Updates' },
    { value: 'status_change', label: 'Status Changes' },
    { value: 'note', label: 'Notes' },
    { value: 'comment', label: 'Comments' },
    { value: 'file_upload', label: 'File Uploads' },
    { value: 'email_sent', label: 'Emails' },
    { value: 'call_made', label: 'Calls' }
  ];

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Loading activity history...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-crm-primary" />
            Lead Activity & History
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Section */}
        {!readOnly && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Comment</label>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment about this lead... Use @username to mention team members"
                rows={3}
                className="w-full"
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <AtSign className="w-3 h-3" />
                Mention users with @username
              </div>
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Add Comment
              </Button>
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  {filterType === 'all' ? 'No activity yet' : `No ${filterType.replace('_', ' ')} activities`}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Activity will appear here as you work with this lead
                </p>
              </div>
            ) : (
              filteredActivities.map((activity, index) => (
                <div key={activity.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                      {activity.userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">{activity.title}</h4>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2 break-words">{activity.description}</p>
                    
                    {/* Show old/new values for updates */}
                    {(activity.oldValue || activity.newValue) && (
                      <div className="flex gap-2 mb-2">
                        {activity.oldValue && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                            From: {activity.oldValue}
                          </Badge>
                        )}
                        {activity.newValue && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            To: {activity.newValue}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">by {activity.user}</p>
                      {activity.mentions && activity.mentions.length > 0 && (
                        <div className="flex gap-1">
                          {activity.mentions.map((mention, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {mention}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Activity Summary */}
        <div className="border-t pt-4">
          <div className="text-sm text-gray-600 text-center">
            Showing {filteredActivities.length} of {activities.length} activities
            {filterType !== 'all' && (
              <button
                onClick={() => setFilterType('all')}
                className="ml-2 text-blue-600 hover:text-blue-700 underline"
              >
                View all activities
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
