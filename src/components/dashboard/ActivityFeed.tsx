
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useDashboardData } from "@/hooks/useDashboardData";

interface ActivityFeedProps {
  userRole: string;
}

export function ActivityFeed({ userRole }: ActivityFeedProps) {
  const { activities, loading } = useDashboardData();

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'lead_created':
        return <Badge className="bg-green-100 text-green-800">Created</Badge>;
      case 'lead_updated':
        return <Badge className="bg-blue-100 text-blue-800">Updated</Badge>;
      case 'status_changed':
        return <Badge className="bg-purple-100 text-purple-800">Status</Badge>;
      case 'note_added':
        return <Badge className="bg-orange-100 text-orange-800">Note</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Activity</Badge>;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center justify-between">
          Recent Activity
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 animate-pulse">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg font-medium">No recent activity</p>
              <p className="text-sm">Activity will appear here as you work with leads</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                    {activity.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.userName}
                    </p>
                    {getActivityBadge(activity.type)}
                  </div>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
