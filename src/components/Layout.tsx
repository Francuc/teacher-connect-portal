import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { CitiesFooter } from "./CitiesFooter";

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