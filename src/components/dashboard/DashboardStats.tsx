
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Calendar, Bell } from 'lucide-react';

const stats = [
  {
    title: "Total Campaigns",
    value: "24",
    icon: Activity,
    change: "+12%",
    changeType: "increase"
  },
  {
    title: "Active Contacts",
    value: "1,234",
    icon: Users,
    change: "+5%",
    changeType: "increase"
  },
  {
    title: "Scheduled Events",
    value: "18",
    icon: Calendar,
    change: "+8%",
    changeType: "increase"
  },
  {
    title: "Pending Notifications",
    value: "7",
    icon: Bell,
    change: "-3%",
    changeType: "decrease"
  }
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-crm-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className={`text-xs ${
              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
