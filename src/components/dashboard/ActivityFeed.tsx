
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ActivityFeedProps {
  userRole: string;
}

export function ActivityFeed({ userRole }: ActivityFeedProps) {
  const getActivitiesForRole = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return [
          {
            user: "System",
            action: "New user registration",
            time: "2 minutes ago",
            type: "user",
            details: "Sarah Johnson joined as Manager"
          },
          {
            user: "Backup Service",
            action: "Daily backup completed",
            time: "1 hour ago",
            type: "system",
            details: "All data successfully backed up"
          },
          {
            user: "Security Monitor",
            action: "Security scan completed",
            time: "3 hours ago",
            type: "security",
            details: "No threats detected"
          },
          {
            user: "Performance Monitor",
            action: "System performance optimal",
            time: "6 hours ago",
            type: "performance",
            details: "All services running smoothly"
          }
        ];
      case 'manager':
        return [
          {
            user: "John Smith",
            action: "Completed lead conversion",
            time: "30 minutes ago",
            type: "conversion",
            details: "TechCorp deal closed - $15K"
          },
          {
            user: "Emily Davis",
            action: "Updated campaign status",
            time: "1 hour ago",
            type: "campaign",
            details: "Q4 Campaign moved to active"
          },
          {
            user: "Mike Johnson",
            action: "Added new lead",
            time: "2 hours ago",
            type: "lead",
            details: "StartupX - Software Development"
          },
          {
            user: "Team Performance",
            action: "Weekly target achieved",
            time: "1 day ago",
            type: "achievement",
            details: "105% of weekly goal completed"
          }
        ];
      case 'employee':
      default:
        return [
          {
            user: "You",
            action: "Updated lead status",
            time: "15 minutes ago",
            type: "lead",
            details: "Acme Corp moved to negotiation"
          },
          {
            user: "You",
            action: "Completed task",
            time: "1 hour ago",
            type: "task",
            details: "Follow-up call with client"
          },
          {
            user: "Manager",
            action: "Assigned new lead",
            time: "2 hours ago",
            type: "assignment",
            details: "Tech Solutions Inc."
          },
          {
            user: "You",
            action: "Added contact note",
            time: "3 hours ago",
            type: "note",
            details: "Discussed pricing options"
          }
        ];
    }
  };

  const activities = getActivitiesForRole(userRole);

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'conversion':
        return <Badge className="bg-green-100 text-green-800">Conversion</Badge>;
      case 'campaign':
        return <Badge className="bg-blue-100 text-blue-800">Campaign</Badge>;
      case 'lead':
        return <Badge className="bg-purple-100 text-purple-800">Lead</Badge>;
      case 'task':
        return <Badge className="bg-orange-100 text-orange-800">Task</Badge>;
      case 'user':
        return <Badge className="bg-indigo-100 text-indigo-800">User</Badge>;
      case 'system':
        return <Badge className="bg-gray-100 text-gray-800">System</Badge>;
      case 'security':
        return <Badge className="bg-red-100 text-red-800">Security</Badge>;
      case 'performance':
        return <Badge className="bg-yellow-100 text-yellow-800">Performance</Badge>;
      case 'achievement':
        return <Badge className="bg-emerald-100 text-emerald-800">Achievement</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Activity</Badge>;
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-800">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {activity.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user}
                  </p>
                  {getActivityBadge(activity.type)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.details}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
