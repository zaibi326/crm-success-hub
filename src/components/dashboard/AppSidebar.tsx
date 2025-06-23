
import React from 'react';
import { Home, Users, Activity, Settings, Bell, Calendar } from 'lucide-react';
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
    title: "Contacts",
    url: "/contacts",
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
  return (
    <Sidebar className="bg-[#111827] border-r-0">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-crm-primary rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">CRM Pro</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="text-white hover:bg-gray-700 hover:text-white group transition-all duration-200"
                  >
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="w-5 h-5 text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-200" />
                      <span className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-sm">
            <div className="font-medium">John Doe</div>
            <div className="text-gray-400">Admin</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
