
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Calendar, Bell, Settings, Activity, Target, Phone, Building2 } from 'lucide-react';
import { 
  Sidebar, 
  SidebarTrigger, 
  SidebarContent, 
  SidebarGroup, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext';
import { canManageUsers, getRoleBasedRedirect } from '@/utils/roleRedirect';
import { useRoleAccess } from '@/hooks/useRoleAccess';

export function AppSidebar() {
  const location = useLocation();
  const { userRole } = useRoleAccess();

  const navigationItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    
    // Core CRM Features
    {
      title: "My Campaigns",
      url: "/campaigns",
      icon: Target,
      badge: userRole === 'Employee' ? 'View Only' : undefined,
      badgeColor: userRole === 'Employee' ? 'bg-yellow-100 text-yellow-800' : undefined
    },
    {
      title: "Current Deals",
      url: "/leads",
      icon: Users,
    },
    
    // Communication Features
    {
      title: "Communication",
      url: "/communication-center",
      icon: Phone,
      badge: "SmrtPhone.io",
      badgeColor: "bg-blue-100 text-blue-800"
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
    
    // Organization & User Management
    ...(userRole === 'Admin' ? [
      {
        title: "Organizations",
        url: "/organization-management",
        icon: Building2,
        badge: "Admin",
        badgeColor: "bg-red-100 text-red-800"
      }
    ] : []),
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    ...(userRole === 'Admin' ? [
      {
        title: "Admin",
        url: "/admin-users",
        icon: Activity,
      }
    ] : []),
  ];

  return (
    <Sidebar className="bg-white/95 backdrop-blur-sm border-r border-gray-200/50 shadow-xl">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                  <a href={item.url} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <SidebarMenuBadge className={item.badgeColor}>
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between w-full p-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="Heirlogic CRM" />
            <AvatarFallback>CRM</AvatarFallback>
          </Avatar>
          <a href="https://heirlogic.com" target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              Heirlogic
            </Button>
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
