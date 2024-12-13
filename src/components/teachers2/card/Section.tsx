import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
}

export const Section = ({ children }: SectionProps) => {
  return (
    <div className="bg-purple-soft/10 p-3 rounded-lg hover:bg-purple-soft/20 transition-all duration-200 hover:shadow-md">
      {children}
    </div>
  );
};