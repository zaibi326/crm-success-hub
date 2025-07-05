
import React from 'react';
import { Home, Users, Activity, Settings, Bell, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getVisibleNavigationItems } from '@/utils/roleRedirect';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

const iconMap: Record<string, React.ComponentType<any>> = {
  '/dashboard': Home,
  '/campaigns': Activity,
  '/leads': Users,
  '/calendar': Calendar,
  '/notifications': Bell,
  '/settings': Settings,
};

export function AppSidebar() {
  const location = useLocation();
  const { user, profile } = useAuth();

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-200 border-red-400/40';
      case 'manager':
        return 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-200 border-blue-400/40';
      case 'employee':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 border-green-400/40';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-200 border-gray-400/40';
    }
  };

  const getUserDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const visibleNavigationItems = getVisibleNavigationItems(profile?.role || 'Employee');

  return (
    <Sidebar className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 border-r-0 shadow-2xl">
      <SidebarHeader className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-2xl ring-2 ring-purple-400/30">
            <span className="text-white font-bold text-lg drop-shadow-lg">H</span>
          </div>
          <div>
            <span className="text-white font-bold text-xl tracking-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Heirlogic CRM
            </span>
            <div className="text-xs text-purple-300 mt-0.5 opacity-90">Professional Edition</div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-4 bg-gradient-to-b from-transparent to-slate-900/20">
        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-300 text-xs uppercase tracking-wider px-4 py-3 font-semibold">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-2">
              {visibleNavigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                const IconComponent = iconMap[item.url] || Home;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`text-gray-200 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-blue-600/30 hover:text-white group transition-all duration-300 rounded-xl mx-2 px-4 py-3 hover:shadow-lg hover:shadow-purple-500/20 ${
                        isActive ? 'bg-gradient-to-r from-purple-600/40 to-blue-600/40 text-white shadow-lg shadow-purple-500/25 border border-purple-400/30' : ''
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-4">
                        <IconComponent className={`w-5 h-5 group-hover:text-white group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.8)] transition-all duration-300 ${
                          isActive ? 'text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'text-gray-400'
                        }`} />
                        <span className={`font-medium group-hover:translate-x-1 transition-all duration-300 ${
                          isActive ? 'text-white font-semibold' : ''
                        }`}>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-purple-500/20 bg-gradient-to-r from-slate-800/60 to-purple-800/40">
        <div className="flex items-center gap-3 text-white">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-xl ring-2 ring-purple-400/40">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-sm flex-1">
            <div className="font-semibold text-gray-100 text-base">
              {getUserDisplayName()}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`text-xs font-medium shadow-lg ${getRoleBadgeColor(profile?.role || 'Employee')}`}>
                {profile?.role || 'Employee'}
              </Badge>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
