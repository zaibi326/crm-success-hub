
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Target, Award, CheckCircle } from 'lucide-react';
import { useDashboardDataContext } from '@/contexts/DashboardDataContext';

interface DashboardStatsProps {
  userRole: string;
}

export function DashboardStats({ userRole }: DashboardStatsProps) {
  const { stats, loading } = useDashboardDataContext();

  const statsConfig = [
    {
      title: 'HOT Deals',
      value: loading ? '...' : stats.hotDeals.toString(),
      percentage: loading ? '...' : stats.totalLeads > 0 ? `${Math.round((stats.hotDeals / stats.totalLeads) * 100)}%` : '0%',
      change: 'Ready to close',
      trend: 'up',
      icon: TrendingUp,
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-500',
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    },
    {
      title: 'WARM Deals',
      value: loading ? '...' : stats.warmDeals.toString(),
      percentage: loading ? '...' : stats.totalLeads > 0 ? `${Math.round((stats.warmDeals / stats.totalLeads) * 100)}%` : '0%',
      change: 'In progress',
      trend: 'up',
      icon: Users,
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-500',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200'
    },
    {
      title: 'COLD Deals',
      value: loading ? '...' : stats.coldDeals.toString(),
      percentage: loading ? '...' : stats.totalLeads > 0 ? `${Math.round((stats.coldDeals / stats.totalLeads) * 100)}%` : '0%',
      change: 'Need attention',
      trend: 'up',
      icon: Target,
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Pass Rate',
      value: loading ? '...' : `${stats.passRate}%`,
      percentage: loading ? '...' : `${stats.passDeals} leads`,
      change: 'Not interested',
      trend: 'neutral',
      icon: Award,
      bgColor: 'bg-gray-50',
      iconBg: 'bg-gray-500',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200'
    },
    {
      title: 'Keep Rate',
      value: loading ? '...' : `${stats.keepRate}%`,
      percentage: loading ? '...' : `${stats.keepDeals} leads`,
      change: 'Marked to keep',
      trend: 'up',
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-500',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <Card 
          key={stat.title} 
          className={`transition-all duration-300 hover:shadow-lg ${stat.bgColor} border-l-4 ${stat.borderColor} animate-fade-in`}
          style={{ 
            animationDelay: `${index * 0.1}s`,
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
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 font-medium">
                  {stat.change}
                </div>
                <div className={`text-xs font-semibold ${stat.textColor}`}>
                  {stat.percentage}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
