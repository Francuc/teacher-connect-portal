import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import Landing from "./pages/Landing";
import TeacherProfileForm from "./components/TeacherProfileForm";
import { TeachersList } from "./components/TeachersList";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "profile/new",
        element: <TeacherProfileForm />,
      },
      {
        path: "profile/:userId",
        element: <TeacherProfileForm />,
      },
      {
        path: "profile/edit/:userId",
        element: <TeacherProfileForm />,
      },
      {
        path: "teachers",
        element: <TeachersList />,
      },
    ],
  },
]);