
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Phone, Calendar, Award } from 'lucide-react';

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
      gradient: 'metric-card-coral',
      iconGradient: 'from-bright-coral to-bright-purple'
    },
    {
      title: 'WARM Deals',
      value: '78',
      change: 'In progress',
      trend: 'up',
      icon: Users,
      gradient: 'metric-card-teal',
      iconGradient: 'from-bright-teal to-bright-blue'
    },
    {
      title: 'COLD Deals',
      value: '123',
      change: 'Need attention',
      trend: 'up',
      icon: Target,
      gradient: 'metric-card-blue',
      iconGradient: 'from-bright-blue to-bright-purple'
    },
    {
      title: 'Pass Rate',
      value: '12%',
      change: '34 of 280 leads',
      trend: 'up',
      icon: Award,
      gradient: 'metric-card-green',
      iconGradient: 'from-bright-green to-bright-teal'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title} 
          className={`metric-card ${stat.gradient} animate-bounce-in`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.iconGradient} shadow-md hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-slate-800 hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stat.trend === 'up' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
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
