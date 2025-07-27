
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Activity, 
  FileText, 
  User, 
  Upload, 
  Edit, 
  MessageSquare,
  Send,
  AtSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActivityItem {
  id: number;
  type: 'created' | 'note' | 'status_change' | 'field_update' | 'file_upload' | 'comment' | 'disposition';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  userInitials: string;
  mentions?: string[];
  oldValue?: string;
  newValue?: string;
}

interface LeadActivityTimelineProps {
  leadId: number;
  readOnly?: boolean;
}

export function LeadActivityTimeline({ leadId, readOnly = false }: LeadActivityTimelineProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 1,
      type: 'created',
      title: 'Lead Created',
      description: 'Lead was imported from campaign data',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      user: 'System',
      userInitials: 'SY'
    },
    {
      id: 2,
      type: 'disposition',
      title: 'Disposition Set',
      description: 'Lead marked as "Keep" for further processing',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      user: 'John Doe',
      userInitials: 'JD'
    },
    {
      id: 3,
      type: 'field_update',
      title: 'Current Arrears Updated',
      description: 'Updated current arrears amount',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      user: 'Jane Smith',
      userInitials: 'JS',
      oldValue: '$0',
      newValue: '$15,750'
    },
    {
      id: 4,
      type: 'file_upload',
      title: 'Probate Document Uploaded',
      description: 'Added probate_order_2024.pdf to the lead',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      user: 'Mike Johnson',
      userInitials: 'MJ'
    },
    {
      id: 5,
      type: 'status_change',
      title: 'Status Changed',
      description: 'Status updated from WARM to HOT',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      user: 'Sarah Wilson',
      userInitials: 'SW',
      oldValue: 'WARM',
      newValue: 'HOT'
    },
    {
      id: 6,
      type: 'note',
      title: 'Note Added',
      description: 'Property owner very motivated to sell quickly. Responded immediately to our call.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: 'John Doe',
      userInitials: 'JD'
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  const handleAddComment = () => {
    if (!newComment.trim()) return;

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

    toast({
      title: "Comment Added",
      description: "Your comment has been added to the activity timeline",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created': return <User className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      case 'status_change': return <Activity className="w-4 h-4" />;
      case 'field_update': return <Edit className="w-4 h-4" />;
      case 'file_upload': return <Upload className="w-4 h-4" />;
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      case 'disposition': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'created': return 'bg-blue-100 text-blue-600';
      case 'note': return 'bg-green-100 text-green-600';
      case 'status_change': return 'bg-purple-100 text-purple-600';
      case 'field_update': return 'bg-orange-100 text-orange-600';
      case 'file_upload': return 'bg-indigo-100 text-indigo-600';
      case 'comment': return 'bg-gray-100 text-gray-600';
      case 'disposition': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-crm-primary" />
          Activity & History
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
                placeholder="Add a comment... Use @username to mention team members"
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
        <div className="space-y-4">
          {activities.map((activity, index) => (
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
                    {activity.timestamp.toLocaleDateString()} {activity.timestamp.toLocaleTimeString()}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
