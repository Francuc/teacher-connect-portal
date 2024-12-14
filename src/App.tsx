import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { TeacherProfile } from "./pages/TeacherProfile";
import { TeacherProfileForm } from "./components/TeacherProfileForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/teachers/:id" element={<TeacherProfile />} />
            <Route path="/profile/:id" element={<TeacherProfileForm />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;