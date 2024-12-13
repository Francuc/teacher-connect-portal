import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import TeacherProfileForm from "@/components/TeacherProfileForm";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "@/pages/Index";
import Teachers2 from "@/pages/Teachers2";
import Landing from "@/pages/Landing";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/teachers" element={<Teachers2 />} />
          <Route path="/profile/new" element={<TeacherProfileForm />} />
          <Route path="/profile/:userId" element={<TeacherProfileForm />} />
          <Route path="/profile/edit/:userId" element={<TeacherProfileForm />} />
        </Routes>
        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  </BrowserRouter>
);