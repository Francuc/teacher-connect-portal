import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import TeacherProfileForm from "@/components/TeacherProfileForm";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Create a component to handle auth redirects
const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash && hash.includes("type=recovery")) {
      // Extract the access token
      const accessToken = new URLSearchParams(hash.substring(1)).get("access_token");
      if (accessToken) {
        // Redirect to update password page with the token
        navigate("/update-password", { state: { accessToken } });
      }
    }
  }, [location, navigate]);

  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <AuthRedirectHandler />
          <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/update-password" element={<ResetPassword mode="update" />} />
              <Route path="/profile/:userId" element={<TeacherProfileForm />} />
              <Route path="/profile/edit/:userId" element={<TeacherProfileForm />} />
              <Route path="/profile/new/:userId" element={<TeacherProfileForm />} />
            </Routes>
          </Layout>
          <Toaster />
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;