
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Activity, Calendar, Bell } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'contact',
    message: 'New contact Sarah Johnson added to CRM',
    time: '2 minutes ago',
    icon: Users,
    avatar: '/placeholder.svg',
    initials: 'SJ',
    color: 'bg-green-500'
  },
  {
    id: 2,
    type: 'campaign',
    message: 'Email campaign "Summer Sale" sent to 500 contacts',
    time: '15 minutes ago',
    icon: Activity,
    avatar: '/placeholder.svg',
    initials: 'ES',
    color: 'bg-blue-500'
  },
  {
    id: 3,
    type: 'meeting',
    message: 'Meeting scheduled with Michael Brown for tomorrow',
    time: '1 hour ago',
    icon: Calendar,
    avatar: '/placeholder.svg',
    initials: 'MB',
    color: 'bg-purple-500'
  },
  {
    id: 4,
    type: 'notification',
    message: 'Follow-up reminder for 3 hot leads',
    time: '2 hours ago',
    icon: Bell,
    avatar: '/placeholder.svg',
    initials: 'FR',
    color: 'bg-orange-500'
  },
  {
    id: 5,
    type: 'contact',
    message: 'Contact Emily Davis updated her preferences',
    time: '4 hours ago',
    icon: Users,
    avatar: '/placeholder.svg',
    initials: 'ED',
    color: 'bg-pink-500'
  }
];

export function ActivityFeed() {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group/item"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0 relative">
                <Avatar className="w-10 h-10 ring-2 ring-white shadow-lg group-hover/item:scale-105 transition-transform duration-200">
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback className={`${activity.color} text-white text-sm font-semibold`}>
                    {activity.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
                  <activity.icon className="w-2.5 h-2.5 text-gray-500" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 mb-1 group-hover/item:text-gray-700 transition-colors">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-500 group-hover/item:text-gray-600 transition-colors">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full text-sm text-crm-primary hover:text-crm-primary/80 font-semibold py-2 px-4 rounded-lg hover:bg-crm-primary/5 transition-all duration-200 group/button">
            <span className="group-hover/button:translate-x-1 transition-transform duration-200 inline-block">
              View all activities →
            </span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
