
import React from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardStats } from './DashboardStats';
import { LeadsPieChart } from './LeadsPieChart';
import { ActivityFeed } from './ActivityFeed';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, BarChart3, Shield } from 'lucide-react';
import { getRoleDashboardTitle } from '@/utils/roleRedirect';
import { useRoleAccess } from '@/hooks/useRoleAccess';

interface DashboardContentProps {
  userRole: string;
}

export function DashboardContent({ userRole }: DashboardContentProps) {
  const dashboardTitle = getRoleDashboardTitle(userRole);
  const { canManageUsers, canManageTeam, canViewAnalytics } = useRoleAccess();
  
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'employee':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <SidebarInset className="flex-1 overflow-auto bg-gradient-to-br from-crm-gradient-start via-white to-crm-gradient-end">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{dashboardTitle}</h1>
              <Badge className={getRoleBadgeColor(userRole)}>
                {userRole}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">
              Welcome back! Here's your {userRole.toLowerCase()} overview for today.
            </p>
          </div>
        </div>
      </header>
      
      <main className="p-6 space-y-8">
        {/* Admin-only Management Section */}
        {canManageUsers && (
          <div className="animate-fade-in-up">
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <Shield className="w-5 h-5" />
                  Admin Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-100">
                    <Users className="w-4 h-4" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-100">
                    <Settings className="w-4 h-4" />
                    System Settings
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-100">
                    <BarChart3 className="w-4 h-4" />
                    Full Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Manager-only Team Management */}
        {canManageTeam && !canManageUsers && (
          <div className="animate-fade-in-up">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Users className="w-5 h-5" />
                  Team Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-100">
                    <Users className="w-4 h-4" />
                    Team Overview
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-100">
                    <BarChart3 className="w-4 h-4" />
                    Team Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="animate-fade-in-up">
          <DashboardStats userRole={userRole} />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-slide-in-right">
          <div className="space-y-8">
            {canViewAnalytics && <LeadsPieChart />}
          </div>
          <div className="space-y-8">
            <ActivityFeed userRole={userRole} />
          </div>
        </div>
      </main>
    </SidebarInset>
  );
}
