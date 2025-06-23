
import React from 'react';
import { Home, Users, Activity, Settings, Bell, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
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

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: Activity,
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Users,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="bg-gradient-to-b from-[#111827] to-[#1f2937] border-r-0 shadow-2xl">
      <SidebarHeader className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-crm-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white drop-shadow-sm" />
          </div>
          <div>
            <span className="text-white font-bold text-xl tracking-tight">CRM Pro</span>
            <div className="text-xs text-gray-400 mt-0.5">Professional Edition</div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider px-4 py-3 font-semibold">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`text-gray-300 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50 hover:text-white group transition-all duration-300 rounded-lg mx-2 px-4 py-3 ${
                        isActive ? 'bg-gradient-to-r from-blue-600/20 to-blue-500/20 text-white border-r-2 border-blue-400' : ''
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-4">
                        <item.icon className={`w-5 h-5 text-gray-400 group-hover:text-white group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-300 ${
                          isActive ? 'text-blue-400' : ''
                        }`} />
                        <span className={`font-medium group-hover:translate-x-1 transition-transform duration-300 ${
                          isActive ? 'text-white' : ''
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
      
      <SidebarFooter className="p-4 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-700/50">
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-gray-300" />
          </div>
          <div className="text-sm">
            <div className="font-semibold text-gray-100">John Doe</div>
            <div className="text-gray-400 text-xs">Administrator</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
