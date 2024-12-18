import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import TeacherProfileForm from "@/components/TeacherProfileForm";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Helper function to get localized path prefix
const getLocalizedPathPrefix = (language: string) => {
  switch (language) {
    case 'fr':
      return 'cours-de-rattrapage';
    case 'lb':
      return 'nohellef';
    default:
      return 'tutoring';
  }
};

// Helper to check if a route should be localized
const shouldLocalizeRoute = (pathname: string) => {
  const nonLocalizedRoutes = ['/auth', '/reset-password', '/update-password'];
  return !nonLocalizedRoutes.some(route => pathname.startsWith(route));
};

function AppRoutes() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only update URL for routes that should be localized
    if (shouldLocalizeRoute(location.pathname)) {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        const currentPrefix = pathSegments[0];
        const newPrefix = getLocalizedPathPrefix(language);
        if (currentPrefix !== newPrefix) {
          const newPath = location.pathname.replace(currentPrefix, newPrefix);
          navigate(newPath, { replace: true });
        }
      }
    }
  }, [language, location.pathname]);

  return (
    <Layout>
      <Routes>
        {/* Non-localized routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Localized routes */}
        <Route path={`/${getLocalizedPathPrefix(language)}/*`} element={<Landing />} />
        <Route path={`/${getLocalizedPathPrefix(language)}/:subject/:teacherName`} element={<TeacherProfileForm />} />
        <Route path={`/${getLocalizedPathPrefix(language)}/edit`} element={<TeacherProfileForm />} />
        <Route path={`/${getLocalizedPathPrefix(language)}/new`} element={<TeacherProfileForm />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <AppRoutes />
          <Toaster />
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;