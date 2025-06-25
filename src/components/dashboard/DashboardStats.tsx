
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Target, BarChart3, UserCheck, Crown } from "lucide-react";

interface DashboardStatsProps {
  userRole: string;
}

export function DashboardStats({ userRole }: DashboardStatsProps) {
  const getStatsForRole = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return [
          {
            title: "Total Users",
            value: "2,847",
            change: "+12.5%",
            icon: Users,
            color: "text-blue-600"
          },
          {
            title: "System Revenue",
            value: "$89,420",
            change: "+8.2%",
            icon: DollarSign,
            color: "text-green-600"
          },
          {
            title: "Active Campaigns",
            value: "23",
            change: "+3.1%",
            icon: Target,
            color: "text-purple-600"
          },
          {
            title: "System Performance",
            value: "99.8%",
            change: "+0.2%",
            icon: BarChart3,
            color: "text-orange-600"
          }
        ];
      case 'manager':
        return [
          {
            title: "Team Members",
            value: "12",
            change: "+2 this month",
            icon: Users,
            color: "text-blue-600"
          },
          {
            title: "Team Revenue",
            value: "$24,350",
            change: "+15.3%",
            icon: DollarSign,
            color: "text-green-600"
          },
          {
            title: "Active Campaigns",
            value: "8",
            change: "+2 this week",
            icon: Target,
            color: "text-purple-600"
          },
          {
            title: "Team Performance",
            value: "94.2%",
            change: "+5.1%",
            icon: TrendingUp,
            color: "text-orange-600"
          }
        ];
      case 'employee':
      default:
        return [
          {
            title: "My Leads",
            value: "47",
            change: "+12% from last week",
            icon: UserCheck,
            color: "text-blue-600"
          },
          {
            title: "Conversions",
            value: "12",
            change: "+18.1%",
            icon: TrendingUp,
            color: "text-green-600"
          },
          {
            title: "My Revenue",
            value: "$3,240",
            change: "+22.5%",
            icon: DollarSign,
            color: "text-purple-600"
          },
          {
            title: "Tasks Completed",
            value: "89%",
            change: "+3.2%",
            icon: Target,
            color: "text-orange-600"
          }
        ];
    }
  };

  const stats = getStatsForRole(userRole);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/70 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium">{stat.change}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
