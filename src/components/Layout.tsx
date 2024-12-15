import { Navigation } from "./Navigation";
import { CitiesFooter } from "./CitiesFooter";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <CitiesFooter />
    </div>
  );
};