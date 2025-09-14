
import React, { useState } from 'react';
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
  MessageCircle,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { TaxLead } from '@/types/taxLead';
import { useLeadActivities, DatabaseActivityItem } from '@/hooks/useLeadActivities';
import { useComprehensiveActivityLogger } from '@/hooks/useComprehensiveActivityLogger';
import { useToast } from '@/hooks/use-toast';

interface DatabaseActivityTimelineProps {
  lead: TaxLead;
  readOnly?: boolean;
}

// Helper function to safely access metadata properties
const getMetadataProperty = (metadata: any, property: string): any => {
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    return metadata[property];
  }
  return null;
};

// Helper function to get user initials from full name
const getUserInitials = (userName: string): string => {
  if (!userName || userName === 'Unknown User') return 'UN';
  return userName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

export function DatabaseActivityTimeline({ 
  lead, 
  readOnly = false 
}: DatabaseActivityTimelineProps) {
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  
  const { data: activities = [], isLoading, error, refetch } = useLeadActivities(lead.id.toString());
  const { logLeadNote, isLogging } = useComprehensiveActivityLogger();
  const { toast } = useToast();

  // Log component mount for debugging
  React.useEffect(() => {
    console.log('DatabaseActivityTimeline mounted for lead:', lead.id);
    console.log('Activities loaded:', activities.length);
  }, [lead.id, activities.length]);

  const handleSubmitComment = async () => {
    if (newComment.trim()) {
      try {
        logLeadNote(
          lead.id.toString(),
          lead.ownerName || 'Unknown',
          newComment,
          'general'
        );
        
        setNewComment('');
        setIsAddingComment(false);
        
        toast({
          title: "Comment Added",
          description: "Your comment has been logged successfully",
        });
        
        // Refetch activities to show the new comment
        refetch();
      } catch (error) {
        console.error('Error adding comment:', error);
        toast({
          title: "Error",
          description: "Failed to add comment. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'created':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'updated':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'deleted':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
      case 'status_change':
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'file_upload':
        return <Upload className="w-4 h-4 text-indigo-600" />;
      case 'call':
        return <Phone className="w-4 h-4 text-green-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'sms':
        return <MessageCircle className="w-4 h-4 text-purple-600" />;
      case 'field_update':
        return <Edit className="w-4 h-4 text-orange-600" />;
      case 'bulk_updated':
      case 'bulk_deleted':
        return <Edit className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (actionType: string) => {
    switch (actionType) {
      case 'created':
        return 'bg-green-100 border-green-200';
      case 'updated':
        return 'bg-blue-100 border-blue-200';
      case 'deleted':
        return 'bg-red-100 border-red-200';
      case 'comment':
        return 'bg-gray-100 border-gray-200';
      case 'status_change':
        return 'bg-orange-100 border-orange-200';
      case 'file_upload':
        return 'bg-indigo-100 border-indigo-200';
      case 'call':
        return 'bg-green-100 border-green-200';
      case 'email':
        return 'bg-blue-100 border-blue-200';
      case 'sms':
        return 'bg-purple-100 border-purple-200';
      case 'field_update':
        return 'bg-orange-100 border-orange-200';
      case 'bulk_updated':
      case 'bulk_deleted':
        return 'bg-purple-100 border-purple-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const filteredActivities = filterType === 'all' 
    ? activities 
    : activities.filter(activity => activity.action_type === filterType);

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'created', label: 'Created' },
    { value: 'updated', label: 'Updated' },
    { value: 'deleted', label: 'Deleted' },
    { value: 'comment', label: 'Comments' },
    { value: 'status_change', label: 'Status Changes' },
    { value: 'file_upload', label: 'File Uploads' },
    { value: 'call', label: 'Calls' },
    { value: 'email', label: 'Emails' },
    { value: 'sms', label: 'SMS' },
    { value: 'field_update', label: 'Field Updates' }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crm-primary"></div>
              <span className="ml-2 text-gray-500">Loading activities...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg border-0">
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
      </div>
    );
  }

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
                  <Button 
                    onClick={handleSubmitComment} 
                    size="sm"
                    disabled={isLogging || !newComment.trim()}
                  >
                    {isLogging ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Add Comment
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAddingComment(false);
                      setNewComment('');
                    }}
                    size="sm"
                    disabled={isLogging}
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
              Activity Timeline ({filteredActivities.length})
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
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getActivityColor(activity.action_type)}`}>
                    {getActivityIcon(activity.action_type)}
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
                        <h4 className="font-medium text-gray-900 capitalize">
                          {activity.action_type.replace('_', ' ')}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {activity.action_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                      
                      {/* Show metadata if available */}
                      {activity.metadata && (
                        <div className="text-xs text-gray-500 mb-2">
                          {getMetadataProperty(activity.metadata, 'fieldName') && (
                            <div className="flex gap-2 mb-1">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                Field: {getMetadataProperty(activity.metadata, 'fieldName')}
                              </Badge>
                            </div>
                          )}
                          {getMetadataProperty(activity.metadata, 'oldValue') && getMetadataProperty(activity.metadata, 'newValue') && (
                            <div className="flex gap-2 mb-1">
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                From: {getMetadataProperty(activity.metadata, 'oldValue')}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                To: {getMetadataProperty(activity.metadata, 'newValue')}
                              </Badge>
                            </div>
                          )}
                          {getMetadataProperty(activity.metadata, 'count') && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                              {getMetadataProperty(activity.metadata, 'count')} items
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Avatar className="w-4 h-4">
                          <AvatarFallback className="text-xs bg-gray-200">
                            {getUserInitials(activity.user_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{activity.user_name}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredActivities.length === 0 && (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No activity found for this lead</p>
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
