
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboardDataContext } from "@/contexts/DashboardDataContext";
import { Activity, Plus, Edit, Trash2, RefreshCw, Settings, Calendar, MessageSquare, Bell, Users, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ActivityFeedProps {
  userRole: string;
}

export function ActivityFeed({ userRole }: ActivityFeedProps) {
  const { activities, loading } = useDashboardDataContext();
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const navigate = useNavigate();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <Plus className="w-4 h-4" />;
      case 'edited':
      case 'updated':
        return <Edit className="w-4 h-4" />;
      case 'deleted':
        return <Trash2 className="w-4 h-4" />;
      case 'assigned':
        return <Users className="w-4 h-4" />;
      case 'noted':
      case 'commented':
        return <MessageSquare className="w-4 h-4" />;
      case 'status_changed':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module.toLowerCase()) {
      case 'leads':
        return <Users className="w-4 h-4" />;
      case 'calendar':
        return <Calendar className="w-4 h-4" />;
      case 'communication':
        return <MessageSquare className="w-4 h-4" />;
      case 'settings':
        return <Settings className="w-4 h-4" />;
      case 'notifications':
        return <Bell className="w-4 h-4" />;
      case 'campaigns':
        return <FileText className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'created':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Created</Badge>;
      case 'edited':
      case 'updated':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Updated</Badge>;
      case 'deleted':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Deleted</Badge>;
      case 'assigned':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Assigned</Badge>;
      case 'noted':
      case 'commented':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Note</Badge>;
      case 'status_changed':
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Status</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Activity</Badge>;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'created':
        return 'text-green-600 bg-green-100';
      case 'edited':
      case 'updated':
        return 'text-blue-600 bg-blue-100';
      case 'deleted':
        return 'text-red-600 bg-red-100';
      case 'assigned':
        return 'text-purple-600 bg-purple-100';
      case 'noted':
      case 'commented':
        return 'text-orange-600 bg-orange-100';
      case 'status_changed':
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
    return timestamp.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleActivityClick = (activity: any) => {
    if (activity.referenceType === 'lead' && activity.referenceId) {
      navigate(`/tax-leads`);
    } else if (activity.module === 'campaigns') {
      navigate('/campaigns');
    } else if (activity.module === 'calendar') {
      navigate('/calendar');
    } else if (activity.module === 'communication') {
      navigate('/communication-center');
    }
  };

  const filteredActivities = activities.filter(activity => {
    const moduleMatch = moduleFilter === 'all' || activity.module.toLowerCase() === moduleFilter;
    const actionMatch = actionFilter === 'all' || activity.actionType === actionFilter;
    return moduleMatch && actionMatch;
  });

  const uniqueModules = Array.from(new Set(activities.map(a => a.module)));
  const uniqueActions = Array.from(new Set(activities.map(a => a.actionType)));

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-gray-800">Recent Activity</span>
            <p className="text-sm text-gray-500 font-normal">
              Latest actions across your CRM
            </p>
          </div>
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          )}
        </CardTitle>
        
        {/* Filters */}
        <div className="flex gap-2 mt-3">
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {uniqueModules.map(module => (
                <SelectItem key={module} value={module.toLowerCase()}>
                  {module.charAt(0).toUpperCase() + module.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {uniqueActions.map(action => (
                <SelectItem key={action} value={action}>
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {loading ? (
              // Loading skeleton
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
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No activities found</p>
                <p className="text-sm">
                  {moduleFilter !== 'all' || actionFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Activity will appear here as you work with the CRM'
                  }
                </p>
              </div>
            ) : (
              filteredActivities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex items-start space-x-3 p-4 rounded-lg bg-white/70 hover:bg-white/90 transition-all duration-200 animate-fade-in border border-gray-100/50 cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleActivityClick(activity)}
                >
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-800 font-semibold">
                        {activity.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${getActivityColor(activity.actionType)}`}>
                          {getActivityIcon(activity.actionType)}
                        </div>
                        <div className={`p-1.5 rounded-full bg-gray-100 text-gray-600`}>
                          {getModuleIcon(activity.module)}
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {activity.userName}
                        </p>
                        {getActivityBadge(activity.actionType)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 break-words leading-relaxed">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 font-medium">
                        {formatTimestamp(activity.timestamp)}
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
  );
}
