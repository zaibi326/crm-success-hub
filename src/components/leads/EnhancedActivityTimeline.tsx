
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  User, 
  FileText, 
  Upload,
  Edit,
  TrendingUp,
  Filter,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { TaxLead } from '@/types/taxLead';
import { ActivityItem } from '@/types/activity';

interface EnhancedActivityTimelineProps {
  lead: TaxLead;
  readOnly?: boolean;
  activities?: ActivityItem[];
}

export function EnhancedActivityTimeline({ 
  lead, 
  readOnly = false, 
  activities: providedActivities 
}: EnhancedActivityTimelineProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Initialize activities
  useEffect(() => {
    if (providedActivities) {
      setActivities(providedActivities);
    } else {
      // Generate default activities based on lead data
      const defaultActivities: ActivityItem[] = [
        {
          id: 1,
          type: 'created',
          title: 'Lead Created',
          description: `Lead for ${lead.ownerName || 'Unknown Owner'} was created`,
          timestamp: new Date(lead.createdAt || Date.now() - 2 * 24 * 60 * 60 * 1000),
          user: 'System',
          userInitials: 'SY'
        }
      ];

      if (lead.notes) {
        defaultActivities.push({
          id: 2,
          type: 'note_added',
          title: 'Note Added',
          description: lead.notes,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          user: 'John Doe',
          userInitials: 'JD'
        });
      }

      if (lead.status) {
        defaultActivities.push({
          id: 3,
          type: 'status_changed',
          title: 'Status Updated',
          description: `Status changed to ${lead.status}`,
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          user: 'Jane Smith',
          userInitials: 'JS',
          newValue: lead.status
        });
      }

      setActivities(defaultActivities);
    }
  }, [lead, providedActivities]);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const newActivity: ActivityItem = {
        id: activities.length + 1,
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
      setIsAddingComment(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'note_added':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'status_changed':
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'field_update':
        return <Edit className="w-4 h-4 text-purple-600" />;
      case 'file_upload':
        return <Upload className="w-4 h-4 text-indigo-600" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
      case 'call':
        return <Phone className="w-4 h-4 text-green-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'sms':
        return <MessageCircle className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'created':
        return 'bg-green-100 border-green-200';
      case 'note_added':
        return 'bg-blue-100 border-blue-200';
      case 'status_changed':
        return 'bg-orange-100 border-orange-200';
      case 'field_update':
        return 'bg-purple-100 border-purple-200';
      case 'file_upload':
        return 'bg-indigo-100 border-indigo-200';
      case 'comment':
        return 'bg-gray-100 border-gray-200';
      case 'call':
        return 'bg-green-100 border-green-200';
      case 'email':
        return 'bg-blue-100 border-blue-200';
      case 'sms':
        return 'bg-purple-100 border-purple-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const filteredActivities = filterType === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filterType);

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'created', label: 'Created' },
    { value: 'note_added', label: 'Notes' },
    { value: 'status_changed', label: 'Status Changes' },
    { value: 'field_update', label: 'Field Updates' },
    { value: 'file_upload', label: 'File Uploads' },
    { value: 'comment', label: 'Comments' },
    { value: 'call', label: 'Calls' },
    { value: 'email', label: 'Emails' },
    { value: 'sms', label: 'SMS' }
  ];

  return (
    <div className="space-y-6">
      {/* Add Comment Section */}
      {!readOnly && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-crm-primary" />
              Add Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAddingComment ? (
              <div className="space-y-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment or note about this lead..."
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSubmitComment} size="sm">
                    Add Comment
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAddingComment(false);
                      setNewComment('');
                    }}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsAddingComment(true)}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Comment
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Activity Timeline */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-crm-primary" />
              Activity Timeline
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter activities" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  {index < filteredActivities.length - 1 && (
                    <div className="w-px h-8 bg-gray-200 mt-2" />
                  )}
                </div>

                {/* Activity content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {activity.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                      
                      {/* Show field changes */}
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
                      
                      {/* Mentions */}
                      {activity.mentions && activity.mentions.length > 0 && (
                        <div className="flex gap-1 mb-2">
                          {activity.mentions.map((mention, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {mention}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Avatar className="w-4 h-4">
                          <AvatarFallback className="text-xs bg-gray-200">
                            {activity.userInitials || activity.user.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredActivities.length === 0 && (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No activity found</p>
                <p className="text-gray-400 text-xs mt-1">
                  {filterType === 'all' 
                    ? 'Activity will appear here as you work with this lead'
                    : 'Try changing the filter to see more activities'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
