
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CurrentDeals from "./pages/CurrentDeals";
import Campaigns from "./pages/Campaigns";
import CommunicationCenter from "./pages/CommunicationCenter";
import Calendar from "./pages/Calendar";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import AdminUsers from "./pages/AdminUsers";
import OrganizationManagement from "./pages/OrganizationManagement";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Security from "./pages/Security";
import Integrations from "./pages/Integrations";
import MobileApps from "./pages/MobileApps";
import ApiDocumentation from "./pages/ApiDocumentation";
import SystemSettings from "./pages/SystemSettings";
import FullAnalytics from "./pages/FullAnalytics";
import AppBuilder from "./pages/AppBuilder";
import Leads from "./pages/Leads";
import TaxLeads from "./pages/TaxLeads";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
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
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/security" element={<Security />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/mobile-apps" element={<MobileApps />} />
              <Route path="/api-docs" element={<ApiDocumentation />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/current-deals" element={
                <ProtectedRoute>
                  <CurrentDeals />
                </ProtectedRoute>
              } />
              
              <Route path="/campaigns" element={
                <ProtectedRoute>
                  <Campaigns />
                </ProtectedRoute>
              } />
              
              <Route path="/communication-center" element={
                <ProtectedRoute>
                  <CommunicationCenter />
                </ProtectedRoute>
              } />
              
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } />
              
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              <Route path="/admin-users" element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              
              <Route path="/organization-management" element={
                <ProtectedRoute>
                  <OrganizationManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/system-settings" element={
                <ProtectedRoute>
                  <SystemSettings />
                </ProtectedRoute>
              } />
              
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <FullAnalytics />
                </ProtectedRoute>
              } />
              
              <Route path="/app-builder" element={
                <ProtectedRoute>
                  <AppBuilder />
                </ProtectedRoute>
              } />
              
              <Route path="/leads" element={
                <ProtectedRoute>
                  <Leads />
                </ProtectedRoute>
              } />
              
              <Route path="/tax-leads" element={
                <ProtectedRoute>
                  <TaxLeads />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
