
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Bell, Settings, Activity, Target, Phone, Building2, Users, Briefcase, Zap } from 'lucide-react';
import { Sidebar, SidebarTrigger, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuBadge, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setOpen } = useSidebar();
  const {
    userRole
  } = useRoleAccess();

  // Auto-collapse sidebar when navigating to leads
  useEffect(() => {
    if (location.pathname === '/leads') {
      setOpen(false);
    }
  }, [location.pathname, setOpen]);

  const navigationItems = [{
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    color: "text-agile-blue"
  }, {
    title: "All Seller Leads",
    url: "/leads",
    icon: Target,
    color: "text-agile-green"
  }, {
    title: "My Campaigns",
    url: "/campaigns",
    icon: Briefcase,
    badge: userRole === 'Employee' ? 'View Only' : undefined,
    badgeColor: userRole === 'Employee' ? 'agile-tag agile-tag-coral text-xs' : undefined,
    color: "text-agile-coral"
  }, {
    title: "Communication",
    url: "/communication-center",
    icon: Phone,
    color: "text-agile-purple"
  }, {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    color: "text-agile-blue"
  }, {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    color: "text-agile-coral"
  }, ...(userRole === 'Admin' ? [{
    title: "Organizations",
    url: "/organization-management",
    icon: Building2,
    color: "text-agile-red"
  }] : []), {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    color: "text-agile-gray-600"
  }];

  const handleNavigation = (url: string) => {
    console.log('Navigating to:', url);
    navigate(url);
  };

  return <Sidebar className="bg-white border-r border-agile-gray-200 shadow-agile">
      <SidebarContent className="p-6">
        {/* Logo Section */}
        <div className="mb-8 p-4 bg-agile-blue-50 rounded-lg border border-agile-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-agile-blue rounded-lg flex items-center justify-center shadow-agile">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-agile-blue">
                Heirlogic
              </h2>
              <p className="text-xs text-agile-gray-500">CRM Dashboard</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-agile-gray-400 uppercase tracking-wider mb-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {navigationItems.map((item, index) => <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className={`agile-sidebar-item ${location.pathname === item.url ? 'active' : ''} animate-slide-in-left`} style={{
              animationDelay: `${index * 0.05}s`
            }} onClick={() => handleNavigation(item.url)}>
                  <div className="w-full justify-start cursor-pointer flex items-center gap-3 p-3 rounded-md transition-all duration-200">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="font-medium text-agile-gray-700">{item.title}</span>
                    {item.badge && <SidebarMenuBadge className={`ml-auto ${item.badgeColor}`}>
                        {item.badge}
                      </SidebarMenuBadge>}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>)}
          </SidebarMenu>
        </SidebarGroup>

        {/* Quick Stats Section */}
        
      </SidebarContent>
    </Sidebar>;
}
