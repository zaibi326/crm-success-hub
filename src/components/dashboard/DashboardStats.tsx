
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Target, Award } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

interface DashboardStatsProps {
  userRole: string;
}

export function DashboardStats({ userRole }: DashboardStatsProps) {
  const { stats, loading } = useDashboardData();

  const statsConfig = [
    {
      title: 'HOT Deals',
      value: loading ? '...' : stats.hotDeals.toString(),
      change: 'Ready to close',
      trend: 'up',
      icon: TrendingUp,
      color: 'red',
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-500',
      textColor: 'text-red-700'
    },
    {
      title: 'WARM Deals',
      value: loading ? '...' : stats.warmDeals.toString(),
      change: 'In progress',
      trend: 'up',
      icon: Users,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-500',
      textColor: 'text-orange-700'
    },
    {
      title: 'COLD Deals',
      value: loading ? '...' : stats.coldDeals.toString(),
      change: 'Need attention',
      trend: 'up',
      icon: Target,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-700'
    },
    {
      title: 'Pass Rate',
      value: loading ? '...' : `${stats.passRate}%`,
      change: `${stats.totalLeads} total leads`,
      trend: 'up',
      icon: Award,
      color: 'gray',
      bgColor: 'bg-gray-50',
      iconBg: 'bg-gray-500',
      textColor: 'text-gray-700'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <Card 
          key={stat.title} 
          className={`transition-all duration-300 hover:shadow-lg ${stat.bgColor} border-l-4 border-l-current`}
          style={{ 
            animationDelay: `${index * 0.1}s`,
            borderLeftColor: stat.iconBg.replace('bg-', '').replace('-500', ''),
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.iconBg} shadow-sm transition-transform duration-200 hover:scale-105`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${stat.textColor} transition-all duration-300`}>
                {stat.value}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500 font-medium">
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
