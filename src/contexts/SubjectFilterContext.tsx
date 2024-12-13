import { createContext, useContext, useState, ReactNode } from 'react';

interface SubjectFilterContextType {
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
}

const SubjectFilterContext = createContext<SubjectFilterContextType | undefined>(undefined);

export const SubjectFilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  return (
    <SubjectFilterContext.Provider value={{ selectedSubject, setSelectedSubject }}>
      {children}
    </SubjectFilterContext.Provider>
  );
};

export const useSubjectFilter = () => {
  const context = useContext(SubjectFilterContext);
  if (context === undefined) {
    throw new Error('useSubjectFilter must be used within a SubjectFilterProvider');
  }
  return context;
};