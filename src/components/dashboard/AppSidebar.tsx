
import {
  Home,
  Target,
  Handshake,
  Users,
  Calendar,
  Bell,
  Settings,
  Shield,
  BarChart3,
  Building2,
  FileText,
  Database
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

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
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";

export function AppSidebar() {
  const { profile } = useAuth();
  const { canManageUsers, canManageTeam, canViewAnalytics } = useRoleAccess();
  const location = useLocation();

  const mainItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      roles: ['Admin']
    },
    {
      title: "My Campaigns",
      url: "/campaigns",
      icon: Target,
      roles: ['Admin', 'Manager']
    },
    {
      title: "Current Deals",
      url: "/leads",
      icon: Handshake,
      roles: ['Admin', 'Manager', 'Employee']
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
      roles: ['Admin', 'Manager', 'Employee']
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: Bell,
      roles: ['Admin', 'Manager', 'Employee']
    }
  ];

  const adminItems = [
    {
      title: "Manage Users",
      url: "/admin/users",
      icon: Users,
      roles: ['Admin']
    },
    {
      title: "System Settings",
      url: "/admin/settings",
      icon: Database,
      roles: ['Admin']
    },
    {
      title: "Full Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
      roles: ['Admin']
    }
  ];

  const userRole = profile?.role || 'Employee';

  const filteredMainItems = mainItems.filter(item => 
    item.roles.includes(userRole)
  );

  const filteredAdminItems = adminItems.filter(item => 
    item.roles.includes(userRole)
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r-2 border-gradient-to-b from-purple-200 to-blue-200">
      <SidebarHeader className="p-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="text-white">
            <h2 className="text-xl font-bold">Heirlogic CRM</h2>
            <p className="text-purple-100 text-sm">Professional Edition</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-gradient-to-b from-gray-50 to-white">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-semibold uppercase tracking-wide text-xs px-6 py-3">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-3">
              {filteredMainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`w-full rounded-xl transition-all duration-200 ${
                      isActive(item.url)
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                        : 'hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 hover:text-purple-700'
                    }`}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3 px-4 py-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {filteredAdminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-red-600 font-semibold uppercase tracking-wide text-xs px-6 py-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Admin Controls
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-3">
                {filteredAdminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`w-full rounded-xl transition-all duration-200 ${
                        isActive(item.url)
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg transform scale-105'
                          : 'hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 hover:text-red-700'
                      }`}
                    >
                      <NavLink to={item.url} className="flex items-center gap-3 px-4 py-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu className="px-3">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className={`w-full rounded-xl transition-all duration-200 ${
                    isActive('/settings')
                      ? 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg'
                      : 'hover:bg-gradient-to-r hover:from-gray-100 hover:to-slate-100 hover:text-gray-700'
                  }`}
                >
                  <NavLink to="/settings" className="flex items-center gap-3 px-4 py-3">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
