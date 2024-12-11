import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen } from "lucide-react";
import { Navigation } from "./Navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const LandingPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-purple.soft/30">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          <BookOpen className="w-16 h-16 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-purple.dark">
            {t("findTeacher")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("landingDescription")}
          </p>
          
          <div className="mt-8">
            <LanguageSwitcher />
          </div>
        </div>
      </main>
    </div>
  );
};