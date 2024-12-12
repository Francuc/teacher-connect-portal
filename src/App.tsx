import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import TeacherProfileForm from "./components/TeacherProfileForm";
import TeachersList from "./components/TeachersList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="profile" element={<TeacherProfileForm />} />
          <Route path="teachers" element={<TeachersList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;