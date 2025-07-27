
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLeadActivities } from '@/hooks/useLeadActivities';
import { useComprehensiveActivityLogger } from '@/hooks/useComprehensiveActivityLogger';
import { 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Phone, 
  Mail, 
  MessageCircle, 
  Upload, 
  TrendingUp, 
  MessageSquare, 
  Clock,
  User,
  FileText
} from 'lucide-react';

interface LeadActivityTimelineProps {
  leadId: string;
  leadName: string;
  readOnly?: boolean;
}

export function LeadActivityTimeline({ leadId, leadName, readOnly = false }: LeadActivityTimelineProps) {
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  
  const { data: activities = [], isLoading, error, refetch } = useLeadActivities(leadId);
  const { logLeadActivity } = useComprehensiveActivityLogger();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    await logLeadActivity(
      'comment',
      `Added comment: ${newComment}`,
      leadId,
      {
        comment: newComment,
        leadName: leadName
      }
    );
    
    setNewComment('');
    setIsAddingComment(false);
    refetch();
  };

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'created':
        return <Plus className="w-4 h-4" />;
      case 'updated':
      case 'edited':
        return <Edit className="w-4 h-4" />;
      case 'deleted':
        return <Trash2 className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageCircle className="w-4 h-4" />;
      case 'file_upload':
        return <Upload className="w-4 h-4" />;
      case 'status_change':
        return <TrendingUp className="w-4 h-4" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4" />;
      case 'viewed':
        return <User className="w-4 h-4" />;
      case 'note_added':
        return <FileText className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (actionType: string) => {
    switch (actionType) {
      case 'created':
        return 'text-green-600 bg-green-100';
      case 'updated':
      case 'edited':
        return 'text-blue-600 bg-blue-100';
      case 'deleted':
        return 'text-red-600 bg-red-100';
      case 'status_change':
        return 'text-indigo-600 bg-indigo-100';
      case 'call':
      case 'email':
      case 'sms':
        return 'text-orange-600 bg-orange-100';
      case 'comment':
        return 'text-purple-600 bg-purple-100';
      case 'viewed':
        return 'text-gray-600 bg-gray-100';
      case 'note_added':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityBadge = (actionType: string) => {
    const getColor = () => {
      switch (actionType) {
        case 'created':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'updated':
        case 'edited':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'deleted':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'status_change':
          return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        case 'call':
        case 'email':
        case 'sms':
          return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'comment':
          return 'bg-purple-100 text-purple-800 border-purple-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <Badge className={`${getColor()} text-xs`}>
        {actionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredActivities = actionFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.action_type === actionFilter);

  const uniqueActions = Array.from(new Set(activities.map(a => a.action_type)));

  if (error) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8 text-red-500">
            <p>Error loading activities. Please try again.</p>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="ml-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Comment Section */}
      {!readOnly && (
        <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
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
                  <Button onClick={handleAddComment} size="sm">
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
      <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <span className="text-gray-800">Lead Activity</span>
                <p className="text-sm text-gray-500 font-normal">
                  Activity timeline for {leadName}
                </p>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Action Filter */}
          <div className="flex gap-2 mt-3">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>
                    {action.charAt(0).toUpperCase() + action.slice(1).replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-white/50 animate-pulse">
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              ) : filteredActivities.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No activities found</p>
                  <p className="text-sm">
                    {actionFilter !== 'all' 
                      ? 'Try changing the filter to see more activities' 
                      : 'Activity will appear here as you work with this lead'
                    }
                  </p>
                </div>
              ) : (
                filteredActivities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start space-x-3 p-4 rounded-lg bg-white/70 hover:bg-white/90 transition-all duration-200 border border-gray-100/50"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex-shrink-0">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-800 font-semibold">
                          {activity.user_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-full ${getActivityColor(activity.action_type)}`}>
                            {getActivityIcon(activity.action_type)}
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {activity.user_name}
                          </p>
                          {getActivityBadge(activity.action_type)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 break-words leading-relaxed">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 font-medium">
                          {formatTimestamp(activity.created_at)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {activity.module}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
