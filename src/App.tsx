import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TeacherProfileForm from "./components/TeacherProfileForm";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile/:userId" element={<TeacherProfileForm />} />
              <Route path="/profile/new" element={<TeacherProfileForm />} />
              <Route path="/profile/edit/:userId" element={<TeacherProfileForm />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;