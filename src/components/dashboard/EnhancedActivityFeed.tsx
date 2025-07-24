
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRecentActivities } from "@/hooks/useRecentActivities";
import { ActivityResetButton } from "./ActivityResetButton";
import { Activity, Plus, Edit, Trash2, RefreshCw, Settings, Calendar, MessageSquare, Bell, Users, FileText, Phone, Mail, MessageCircle, Upload, TrendingUp, LogIn, LogOut, UserPlus, Shield, Database } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface EnhancedActivityFeedProps {
  userRole: string;
}

export function EnhancedActivityFeed({ userRole }: EnhancedActivityFeedProps) {
  const { activities, isLoading, error, refetch } = useRecentActivities(100);
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const navigate = useNavigate();

  const getActivityIcon = (actionType: string, module: string) => {
    // Module-specific icons
    switch (module) {
      case 'leads':
        if (actionType === 'created') return <Plus className="w-4 h-4" />;
        if (actionType === 'status_change') return <TrendingUp className="w-4 h-4" />;
        if (actionType === 'updated') return <Edit className="w-4 h-4" />;
        if (actionType === 'deleted') return <Trash2 className="w-4 h-4" />;
        return <Users className="w-4 h-4" />;
      case 'campaigns':
        if (actionType === 'created') return <Plus className="w-4 h-4" />;
        return <FileText className="w-4 h-4" />;
      case 'communication':
        if (actionType === 'call') return <Phone className="w-4 h-4" />;
        if (actionType === 'email') return <Mail className="w-4 h-4" />;
        if (actionType === 'sms') return <MessageCircle className="w-4 h-4" />;
        return <MessageSquare className="w-4 h-4" />;
      case 'calendar':
        return <Calendar className="w-4 h-4" />;
      case 'auth':
        if (actionType === 'login') return <LogIn className="w-4 h-4" />;
        if (actionType === 'logout') return <LogOut className="w-4 h-4" />;
        if (actionType === 'registered') return <UserPlus className="w-4 h-4" />;
        return <Shield className="w-4 h-4" />;
      case 'organization':
        return <Users className="w-4 h-4" />;
      case 'settings':
        return <Settings className="w-4 h-4" />;
      case 'notifications':
        return <Bell className="w-4 h-4" />;
      case 'system':
        return <Database className="w-4 h-4" />;
      default:
        // Action-specific fallback
        switch (actionType) {
          case 'created':
            return <Plus className="w-4 h-4" />;
          case 'updated':
          case 'edited':
            return <Edit className="w-4 h-4" />;
          case 'deleted':
            return <Trash2 className="w-4 h-4" />;
          case 'file_upload':
            return <Upload className="w-4 h-4" />;
          case 'status_change':
            return <TrendingUp className="w-4 h-4" />;
          default:
            return <Activity className="w-4 h-4" />;
        }
    }
  };

  const getActivityBadge = (actionType: string, module: string) => {
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
        case 'login':
        case 'logout':
          return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'call':
        case 'email':
        case 'sms':
          return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'reset_logs':
          return 'bg-red-100 text-red-800 border-red-200';
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

  const getActivityColor = (actionType: string, module: string) => {
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
      case 'login':
      case 'logout':
        return 'text-purple-600 bg-purple-100';
      case 'call':
      case 'email':
      case 'sms':
        return 'text-orange-600 bg-orange-100';
      case 'reset_logs':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
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

  const getTargetDisplay = (activity: any) => {
    if (activity.target_type === 'lead' && activity.target_id) {
      return `Lead #${activity.target_id}`;
    }
    if (activity.target_type === 'campaign' && activity.target_id) {
      return `Campaign #${activity.target_id}`;
    }
    if (activity.target_type === 'event' && activity.target_id) {
      return `Event #${activity.target_id}`;
    }
    if (activity.reference_type === 'lead' && activity.reference_id) {
      return `Lead #${activity.reference_id}`;
    }
    if (activity.reference_type === 'campaign' && activity.reference_id) {
      return `Campaign #${activity.reference_id}`;
    }
    return null;
  };

  const handleActivityClick = (activity: any) => {
    switch (activity.module) {
      case 'leads':
        navigate('/tax-leads');
        break;
      case 'campaigns':
        navigate('/campaigns');
        break;
      case 'calendar':
        navigate('/calendar');
        break;
      case 'communication':
        navigate('/communication-center');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'organization':
        navigate('/organization-management');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      default:
        break;
    }
  };

  const filteredActivities = activities.filter(activity => {
    const moduleMatch = moduleFilter === 'all' || activity.module.toLowerCase() === moduleFilter;
    const actionMatch = actionFilter === 'all' || activity.action_type === actionFilter;
    return moduleMatch && actionMatch;
  });

  const uniqueModules = Array.from(new Set(activities.map(a => a.module)));
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
            <ActivityResetButton />
          </div>
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
                  {action.charAt(0).toUpperCase() + action.slice(1).replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {isLoading ? (
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
                        {activity.user_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${getActivityColor(activity.action_type, activity.module)}`}>
                          {getActivityIcon(activity.action_type, activity.module)}
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {activity.user_name}
                        </p>
                        {getActivityBadge(activity.action_type, activity.module)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 break-words leading-relaxed">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 font-medium">
                        {formatTimestamp(activity.created_at)}
                      </p>
                      <div className="flex items-center gap-2">
                        {getTargetDisplay(activity) && (
                          <Badge variant="secondary" className="text-xs">
                            {getTargetDisplay(activity)}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {activity.module}
                        </Badge>
                      </div>
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
