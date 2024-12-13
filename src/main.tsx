import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Layout } from "@/components/Layout";
import { Index } from "@/pages/Index";
import { Auth } from "@/pages/Auth";
import { Landing } from "@/pages/Landing";
import { Teachers2 } from "@/pages/Teachers2";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "teachers",
        element: <Index />,
      },
      {
        path: "teachers2",
        element: <Teachers2 />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RouterProvider router={router} />
        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  </React.StrictMode>
);