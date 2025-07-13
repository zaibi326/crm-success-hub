
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Activity, 
  MessageSquare, 
  Send, 
  AtSign, 
  User, 
  FileText, 
  Tag, 
  Edit, 
  Paperclip 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActivityItem {
  id: number;
  type: 'created' | 'note' | 'status_change' | 'field_update' | 'file_upload' | 'comment';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  userInitials: string;
  mentions?: string[];
}

interface ActivityTimelineSectionProps {
  activities: ActivityItem[];
  onAddComment: (comment: string) => void;
}

export function ActivityTimelineSection({ activities, onAddComment }: ActivityTimelineSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    onAddComment(newComment);
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
      case 'status_change': return <Tag className="w-4 h-4" />;
      case 'field_update': return <Edit className="w-4 h-4" />;
      case 'file_upload': return <Paperclip className="w-4 h-4" />;
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Comment Input */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-crm-primary" />
            Add Comment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment... Use @username to mention team members"
              rows={3}
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                <AtSign className="w-3 h-3 inline mr-1" />
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
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-crm-primary" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        {getActivityIcon(activity.type)}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">{activity.title}</h4>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {activity.timestamp.toLocaleDateString()} {activity.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1 break-words">{activity.description}</p>
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
    </>
  );
}
