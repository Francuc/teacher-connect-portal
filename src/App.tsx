import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Teachers2 from "./pages/Teachers2";
import TeacherProfileForm from "./components/TeacherProfileForm";
import { LanguageProvider } from "./contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="auth" element={<Auth />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="tutoring" element={<Teachers2 />} />
              <Route path="cours-de-rattrapage" element={<Teachers2 />} />
              <Route path="nohellef" element={<Teachers2 />} />
              <Route path="tutoring/:subject/:teacherName" element={<TeacherProfileForm />} />
              <Route path="cours-de-rattrapage/:subject/:teacherName" element={<TeacherProfileForm />} />
              <Route path="nohellef/:subject/:teacherName" element={<TeacherProfileForm />} />
              <Route path="tutoring/edit/:teacherId?" element={<TeacherProfileForm />} />
              <Route path="cours-de-rattrapage/edit/:teacherId?" element={<TeacherProfileForm />} />
              <Route path="nohellef/edit/:teacherId?" element={<TeacherProfileForm />} />
              <Route path="profile/edit/:teacherId" element={<TeacherProfileForm />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;