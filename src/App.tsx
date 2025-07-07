
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import TaxLeads from "./pages/TaxLeads";
import Campaigns from "./pages/Campaigns";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import SystemSettings from "./pages/SystemSettings";
import OrganizationManagement from "./pages/OrganizationManagement";
import AdminUsers from "./pages/AdminUsers";
import CommunicationCenter from "./pages/CommunicationCenter";
import Notifications from "./pages/Notifications";
import Pricing from "./pages/Pricing";
import FullAnalytics from "./pages/FullAnalytics";
import AppBuilder from "./pages/AppBuilder";
import Features from "./pages/Features";
import Integrations from "./pages/Integrations";
import ApiDocumentation from "./pages/ApiDocumentation";
import MobileApps from "./pages/MobileApps";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/tax-leads" element={<TaxLeads />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/system-settings" element={<SystemSettings />} />
            <Route path="/organization-management" element={<OrganizationManagement />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/communication-center" element={<CommunicationCenter />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/analytics" element={<FullAnalytics />} />
            <Route path="/app-builder" element={<AppBuilder />} />
            <Route path="/features" element={<Features />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/api-documentation" element={<ApiDocumentation />} />
            <Route path="/mobile-apps" element={<MobileApps />} />
            <Route path="/security" element={<Security />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
