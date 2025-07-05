
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import Calendar from "./pages/Calendar";
import Notifications from "./pages/Notifications";
import AdminUsers from "./pages/AdminUsers";
import SystemSettings from "./pages/SystemSettings";
import FullAnalytics from "./pages/FullAnalytics";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            {/* My Campaigns - Admin and Manager can create/view campaigns */}
            <Route 
              path="/campaigns" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                  <Campaigns />
                </ProtectedRoute>
              } 
            />
            {/* Current Deals - All roles can view leads/deals assigned to them */}
            <Route 
              path="/leads" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Employee']}>
                  <Leads />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Employee']}>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Employee']}>
                  <Calendar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Employee']}>
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <SystemSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <FullAnalytics />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
