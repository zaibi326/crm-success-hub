
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  User, 
  FileText, 
  Upload,
  Edit,
  TrendingUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

export function ActivityTimelineSection({ 
  activities, 
  onAddComment 
}: ActivityTimelineSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
      setIsAddingComment(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'note':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'status_change':
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'field_update':
        return <Edit className="w-4 h-4 text-purple-600" />;
      case 'file_upload':
        return <Upload className="w-4 h-4 text-indigo-600" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'created':
        return 'bg-green-100 border-green-200';
      case 'note':
        return 'bg-blue-100 border-blue-200';
      case 'status_change':
        return 'bg-orange-100 border-orange-200';
      case 'field_update':
        return 'bg-purple-100 border-purple-200';
      case 'file_upload':
        return 'bg-indigo-100 border-indigo-200';
      case 'comment':
        return 'bg-gray-100 border-gray-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Comment Section */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-crm-primary" />
            Activity & Comments
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

      {/* Activity Timeline */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  {index < activities.length - 1 && (
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
                            {activity.userInitials}
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

            {activities.length === 0 && (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No activity yet</p>
                <p className="text-gray-400 text-xs mt-1">
                  Activity will appear here as you work with this lead
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
