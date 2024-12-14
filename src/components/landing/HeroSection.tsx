import { BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary/95 to-secondary/95 rounded-[2rem] shadow-lg mt-12 mx-4">
      <div className="absolute inset-0 bg-purple.dark/5 pattern-grid-lg opacity-10"></div>
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
          <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
            {t("findTeacher")}
          </h1>
          <p className="text-sm md:text-base text-white/90 max-w-lg">
            {t("landingDescription")}
          </p>
        </div>
      </div>
    </div>
  );
};