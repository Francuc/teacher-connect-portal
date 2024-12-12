import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import TeacherProfileForm from "./components/TeacherProfileForm";
import { TeachersList } from "./components/TeachersList";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="profile" element={<TeacherProfileForm />} />
            <Route path="teachers" element={<TeachersList />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;