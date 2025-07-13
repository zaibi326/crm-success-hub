
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Bell, Settings, Activity, Target, Phone, Building2, Filter, Users, Briefcase } from 'lucide-react';
import { 
  Sidebar, 
  SidebarTrigger, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupLabel,
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
  const navigate = useNavigate();
  const { userRole } = useRoleAccess();

  const navigationItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    
    // Seller Leads Management - Podio style grouping
    {
      title: "All Seller Leads",
      url: "/leads",
      icon: Target,
      badge: "Enhanced",
      badgeColor: "bg-podio-primary/10 text-podio-primary"
    },
    
    // Core CRM Features
    {
      title: "My Campaigns",
      url: "/campaigns", 
      icon: Briefcase,
      badge: userRole === 'Employee' ? 'View Only' : undefined,
      badgeColor: userRole === 'Employee' ? 'bg-amber-100 text-amber-800' : undefined
    },
    
    // Communication Features
    {
      title: "Communication",
      url: "/communication-center",
      icon: Phone,
      badge: "SmrtPhone.io",
      badgeColor: "bg-podio-primary/10 text-podio-primary"
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
  ];

  const handleNavigation = (url: string) => {
    console.log('Navigating to:', url);
    navigate(url);
  };

  return (
    <Sidebar className="bg-podio-background border-r border-podio-border shadow-podio">
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-podio-text-muted uppercase tracking-wider mb-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  className={`podio-sidebar-item ${location.pathname === item.url ? 'active' : ''}`}
                >
                  <button 
                    className="w-full justify-start cursor-pointer flex items-center gap-2 p-2 rounded-md hover:bg-podio-hover transition-colors"
                    onClick={() => handleNavigation(item.url)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-normal">{item.title}</span>
                    {item.badge && (
                      <SidebarMenuBadge className={`ml-auto text-xs px-2 py-1 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Quick Filters Section - Podio style */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-podio-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
            <Filter className="w-3 h-3" />
            Quick Filters
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton className="podio-sidebar-item text-xs">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Hot Leads</span>
                <span className="ml-auto text-podio-text-muted">12</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="podio-sidebar-item text-xs">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Warm Leads</span>
                <span className="ml-auto text-podio-text-muted">24</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="podio-sidebar-item text-xs">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Cold Leads</span>
                <span className="ml-auto text-podio-text-muted">8</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="podio-sidebar-item text-xs">
                <Users className="w-3 h-3" />
                <span>Untouched</span>
                <span className="ml-auto text-podio-text-muted">15</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-podio-border">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback className="bg-podio-primary text-white text-xs">CRM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-podio-text">Admin User</span>
              <span className="text-xs text-podio-text-muted">admin@heirlogic.com</span>
            </div>
          </div>
          <a href="https://heirlogic.com" target="_blank" rel="noreferrer">
            <Button variant="ghost" size="sm" className="podio-button-secondary h-8 px-2 text-xs">
              Heirlogic
            </Button>
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
