import { Navigation } from "./Navigation";
import { CitiesFooter } from "./CitiesFooter";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <CitiesFooter />
    </div>
  );
};