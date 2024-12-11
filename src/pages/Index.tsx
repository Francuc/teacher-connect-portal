import { LanguageProvider } from "@/contexts/LanguageContext";
import { LandingPage } from "@/components/LandingPage";

const Index = () => {
  return (
    <LanguageProvider>
      <LandingPage />
    </LanguageProvider>
  );
};

export default Index;