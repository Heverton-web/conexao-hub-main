import React from "react";
import { Toaster } from "@/presentation/components/ui/toaster";
import { Toaster as Sonner } from "@/presentation/components/ui/sonner";
import { TooltipProvider } from "@/presentation/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "./presentation/contexts/ThemeContext";
import { LanguageProvider } from "./presentation/contexts/LanguageContext";
import { BrandProvider } from "./presentation/contexts/BrandContext";
import { AuthProvider, useAuth } from "./presentation/contexts/AuthContext";
import { useBrand } from "./presentation/contexts/BrandContext";
import { ShortcutProvider } from "./presentation/contexts/ShortcutContext";
import { Layout } from "./presentation/components/hub/Layout";
import { GlobalEffects } from "./presentation/components/hub/GlobalEffects";
import { KeyboardHelpModal } from "./presentation/components/hub/KeyboardHelpModal";
import { AuthPage } from "./presentation/pages/AuthPage";
import { ManagerDashboard } from "./presentation/pages/ManagerDashboard";
import { Dashboard } from "./presentation/pages/Dashboard";
import { Admin } from "./presentation/pages/Admin";
import { RegistrationProgress } from "./presentation/components/hub/RegistrationProgress";
import { WebhooksPage } from "./presentation/pages/WebhooksPage";
import { SetupPage } from "./presentation/pages/SetupPage";
import KnowledgeCenter from "./presentation/pages/KnowledgeCenter";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

const AppContent = () => {
  const { user, isAuthenticated, isLoading, isSetupRequired } = useAuth();
  const { setActiveEnvironment } = useBrand();

  // Set active environment based on user role
  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      setActiveEnvironment('auth');
      return;
    }
    if (user.role === 'super_admin') setActiveEnvironment('admin');
    else if (user.role === 'manager') setActiveEnvironment('manager');
    else setActiveEnvironment('client');
  }, [isAuthenticated, user, setActiveEnvironment]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    if (isSetupRequired) {
      return <SetupPage />;
    }
    return <AuthPage />;
  }

  // Show progress screen for pending/rejected users (unless admin)
  if (user.status === 'pending' || user.status === 'rejected') {
    return <RegistrationProgress />;
  }

  const isAdmin = user.role === 'super_admin';
  const isManager = user.role === 'manager';

  return (
    <ShortcutProvider>
      <Layout>
        <GlobalEffects />
        <KeyboardHelpModal />
        <Routes>
          <Route path="/knowledge-center" element={<KnowledgeCenter />} />
          <Route path="/" element={isAdmin ? <Admin /> : isManager ? <ManagerDashboard /> : <Dashboard />} />
        </Routes>
      </Layout>
    </ShortcutProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LanguageProvider>
          <BrandProvider>
            <BrowserRouter>
              <AuthProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/webhooks" element={<WebhooksPage />} />
                  <Route path="/*" element={<AppContent />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </BrandProvider>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

