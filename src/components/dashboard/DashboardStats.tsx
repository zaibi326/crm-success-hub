
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Phone, Calendar, Award } from 'lucide-react';

interface DashboardStatsProps {
  userRole: string;
}

export function DashboardStats({ userRole }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Leads',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      gradient: 'metric-card-teal',
      iconGradient: 'from-bright-teal to-bright-blue'
    },
    {
      title: 'Revenue',
      value: '$847,293',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      gradient: 'metric-card-green',
      iconGradient: 'from-bright-green to-bright-teal'
    },
    {
      title: 'Conversion Rate',
      value: '24.3%',
      change: '+3.1%',
      trend: 'up',
      icon: Target,
      gradient: 'metric-card-purple',
      iconGradient: 'from-bright-purple to-bright-coral'
    },
    {
      title: 'Active Campaigns',
      value: '18',
      change: '+2',
      trend: 'up',
      icon: Award,
      gradient: 'metric-card-coral',
      iconGradient: 'from-bright-coral to-bright-purple'
    },
    {
      title: 'Calls Made',
      value: '1,247',
      change: '+15.8%',
      trend: 'up',
      icon: Phone,
      gradient: 'metric-card-blue',
      iconGradient: 'from-bright-blue to-bright-purple'
    },
    {
      title: 'Appointments',
      value: '89',
      change: '+7.4%',
      trend: 'up',
      icon: Calendar,
      gradient: 'metric-card-teal',
      iconGradient: 'from-bright-teal to-bright-green'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
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
                <span className="text-xs text-slate-500">vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
