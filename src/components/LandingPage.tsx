import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen } from "lucide-react";
import { TeachersList } from "./TeachersList";
import { useState } from "react";

export const LandingPage = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple.soft via-white to-purple.soft/20">
      <main>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary/95 to-secondary/95 py-32">
          <div className="absolute inset-0 bg-purple.dark/5 pattern-grid-lg opacity-10"></div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center space-y-10 max-w-4xl mx-auto">
              <div className="p-6 bg-white/10 rounded-full backdrop-blur-sm">
                <BookOpen className="w-20 h-20 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                {t("findTeacher")}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
                {t("landingDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* Teachers List Section */}
        <div className="py-16 bg-gradient-to-b from-white to-purple.soft/20">
          <TeachersList initialSearchQuery={searchQuery} />
        </div>
      </main>
    </div>
  );
};