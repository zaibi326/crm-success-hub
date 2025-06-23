
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Calendar, Bell } from 'lucide-react';

const stats = [
  {
    title: "Total Campaigns",
    value: 24,
    icon: Activity,
    change: "+12%",
    changeType: "increase"
  },
  {
    title: "HOT Leads",
    value: 87,
    icon: Users,
    change: "+15%",
    changeType: "increase",
    color: "text-red-500"
  },
  {
    title: "WARM Leads",
    value: 142,
    icon: Users,
    change: "+8%",
    changeType: "increase",
    color: "text-orange-500"
  },
  {
    title: "COLD Leads",
    value: 63,
    icon: Users,
    change: "-3%",
    changeType: "decrease",
    color: "text-blue-500"
  }
];

interface AnimatedCounterProps {
  target: number;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card 
          key={stat.title} 
          className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              {stat.title}
            </CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-crm-primary/10 to-crm-primary/20 group-hover:from-crm-primary/20 group-hover:to-crm-primary/30 transition-all duration-300">
              <stat.icon className={`h-4 w-4 ${stat.color || 'text-crm-primary'} group-hover:scale-110 transition-transform duration-300`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stat.color || 'text-gray-900'} group-hover:scale-105 transition-transform duration-300`}>
              <AnimatedCounter target={stat.value} />
            </div>
            <p className={`text-xs flex items-center gap-1 mt-2 ${
              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className={`inline-block w-2 h-2 rounded-full ${
                stat.changeType === 'increase' ? 'bg-green-500' : 'bg-red-500'
              } animate-pulse`}></span>
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
