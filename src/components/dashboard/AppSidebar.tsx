
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Bell, Settings, Activity, Target, Phone, Building2, Filter, Users, Briefcase, Sparkles } from 'lucide-react';
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
      gradient: "from-bright-teal to-bright-blue"
    },
    
    {
      title: "All Seller Leads",
      url: "/leads",
      icon: Target,
      gradient: "from-bright-green to-bright-teal"
    },
    
    {
      title: "My Campaigns",
      url: "/campaigns", 
      icon: Briefcase,
      badge: userRole === 'Employee' ? 'View Only' : undefined,
      badgeColor: userRole === 'Employee' ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200' : undefined,
      gradient: "from-bright-coral to-bright-purple"
    },
    
    {
      title: "Communication",
      url: "/communication-center",
      icon: Phone,
      gradient: "from-bright-blue to-bright-purple"
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
      gradient: "from-bright-purple to-bright-coral"
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: Bell,
      gradient: "from-bright-coral to-bright-green"
    },
    
    ...(userRole === 'Admin' ? [
      {
        title: "Organizations",
        url: "/organization-management",
        icon: Building2,
        badge: "Admin",
        badgeColor: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200",
        gradient: "from-red-500 to-pink-500"
      }
    ] : []),
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      gradient: "from-gray-500 to-slate-600"
    },
  ];

  const handleNavigation = (url: string) => {
    console.log('Navigating to:', url);
    navigate(url);
  };

  return (
    <Sidebar className="bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 border-r border-white/20 shadow-bright backdrop-blur-sm">
      <SidebarContent className="p-6">
        {/* Logo Section */}
        <div className="mb-8 p-4 bg-gradient-to-r from-bright-teal/10 to-bright-blue/10 rounded-xl border border-white/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-bright-teal to-bright-blue rounded-lg flex items-center justify-center shadow-lg animate-pulse-slow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg bg-gradient-to-r from-bright-teal to-bright-blue bg-clip-text text-transparent">
                Heirlogic
              </h2>
              <p className="text-xs text-slate-500">CRM Dashboard</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <div className="w-4 h-0.5 bg-gradient-to-r from-bright-teal to-bright-blue rounded"></div>
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-2">
            {navigationItems.map((item, index) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  className={`sidebar-item ${location.pathname === item.url ? 'active' : ''} animate-slide-in-left`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleNavigation(item.url)}
                >
                  <div className="w-full justify-start cursor-pointer flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:scale-105 group">
                    <div className={`sidebar-item-icon p-2 rounded-lg bg-gradient-to-r ${item.gradient} shadow-md`}>
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{item.title}</span>
                    {item.badge && (
                      <SidebarMenuBadge className={`ml-auto text-xs px-3 py-1 rounded-full backdrop-blur-sm ${item.badgeColor}`}>
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Quick Stats Section */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Filter className="w-3 h-3" />
            Quick Stats
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-2">
            <SidebarMenuItem>
              <SidebarMenuButton className="sidebar-item text-sm hover:scale-105 transition-all duration-300">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-neon-teal"></div>
                <span>Hot Leads</span>
                <span className="ml-auto text-slate-500 font-bold">12</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="sidebar-item text-sm hover:scale-105 transition-all duration-300">
                <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                <span>Warm Leads</span>
                <span className="ml-auto text-slate-500 font-bold">24</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="sidebar-item text-sm hover:scale-105 transition-all duration-300">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                <span>Cold Leads</span>
                <span className="ml-auto text-slate-500 font-bold">8</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="sidebar-item text-sm hover:scale-105 transition-all duration-300">
                <Users className="w-3 h-3 text-bright-purple" />
                <span>Untouched</span>
                <span className="ml-auto text-slate-500 font-bold">15</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-white/20 bg-gradient-to-r from-white/50 to-slate-50/50 backdrop-blur-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white shadow-bright">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-bright-teal to-bright-blue text-white text-sm font-bold">CRM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-800">Admin User</span>
              <span className="text-xs text-slate-500">admin@heirlogic.com</span>
            </div>
          </div>
          <a href="https://heirlogic.com" target="_blank" rel="noreferrer">
            <Button variant="ghost" size="sm" className="bright-button-primary h-8 px-3 text-xs">
              Visit Site
            </Button>
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
