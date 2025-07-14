
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Target, Award } from 'lucide-react';

interface DashboardStatsProps {
  userRole: string;
}

export function DashboardStats({ userRole }: DashboardStatsProps) {
  const stats = [
    {
      title: 'HOT Deals',
      value: '45',
      change: 'Ready to close',
      trend: 'up',
      icon: TrendingUp,
      color: 'red',
      bgColor: 'bg-agile-red-50',
      iconBg: 'bg-agile-red',
      textColor: 'text-agile-red-700'
    },
    {
      title: 'WARM Deals',
      value: '78',
      change: 'In progress',
      trend: 'up',
      icon: Users,
      color: 'coral',
      bgColor: 'bg-agile-coral-50',
      iconBg: 'bg-agile-coral',
      textColor: 'text-agile-coral-700'
    },
    {
      title: 'COLD Deals',
      value: '123',
      change: 'Need attention',
      trend: 'up',
      icon: Target,
      color: 'blue',
      bgColor: 'bg-agile-blue-50',
      iconBg: 'bg-agile-blue',
      textColor: 'text-agile-blue-700'
    },
    {
      title: 'Pass Rate',
      value: '12%',
      change: '34 of 280 leads',
      trend: 'up',
      icon: Award,
      color: 'green',
      bgColor: 'bg-agile-green-50',
      iconBg: 'bg-agile-green',
      textColor: 'text-agile-green-700'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title} 
          className={`agile-card agile-card-hover animate-fade-in ${stat.bgColor} border-l-4 border-l-${stat.iconBg.replace('bg-', '')}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-agile-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.iconBg} shadow-agile`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-agile-gray-500 font-medium">
                  {stat.change}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
