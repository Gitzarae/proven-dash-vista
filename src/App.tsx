import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import TopManagementDashboard from "./pages/dashboards/TopManagementDashboard";
import ProjectOwnerDashboard from "./pages/dashboards/ProjectOwnerDashboard";
import ProjectManagerDashboard from "./pages/dashboards/ProjectManagerDashboard";
import ProjectOfficerDashboard from "./pages/dashboards/ProjectOfficerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import Portfolio from "./pages/Portfolio";
import Decisions from "./pages/Decisions";
import Issues from "./pages/Issues";
import Meetings from "./pages/Meetings";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/top-management" element={<TopManagementDashboard />} />
        <Route path="dashboard/project-owner" element={<ProjectOwnerDashboard />} />
        <Route path="dashboard/project-manager" element={<ProjectManagerDashboard />} />
        <Route path="dashboard/project-officer" element={<ProjectOfficerDashboard />} />
        <Route path="dashboard/admin" element={<AdminDashboard />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="decisions" element={<Decisions />} />
        <Route path="issues" element={<Issues />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
