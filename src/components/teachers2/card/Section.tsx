import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
}

export const Section = ({ children }: SectionProps) => {
  return (
    <div className="bg-purple-soft/10 p-2 rounded-lg">
      {children}
    </div>
  );
};