
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Mail, Calendar, Bell } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'contact',
    message: 'New contact Sarah Johnson added to CRM',
    time: '2 minutes ago',
    icon: Users,
    avatar: 'SJ'
  },
  {
    id: 2,
    type: 'email',
    message: 'Email campaign "Summer Sale" sent to 500 contacts',
    time: '15 minutes ago',
    icon: Mail,
    avatar: 'ES'
  },
  {
    id: 3,
    type: 'meeting',
    message: 'Meeting scheduled with Michael Brown for tomorrow',
    time: '1 hour ago',
    icon: Calendar,
    avatar: 'MB'
  },
  {
    id: 4,
    type: 'notification',
    message: 'Follow-up reminder for 3 hot leads',
    time: '2 hours ago',
    icon: Bell,
    avatar: 'FR'
  },
  {
    id: 5,
    type: 'contact',
    message: 'Contact Emily Davis updated her preferences',
    time: '4 hours ago',
    icon: Users,
    avatar: 'ED'
  }
];

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-crm-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {activity.avatar}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 mb-1">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.time}
                </p>
              </div>
              <div className="flex-shrink-0">
                <activity.icon className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-sm text-crm-primary hover:text-crm-primary/80 font-medium">
            View all activities
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
