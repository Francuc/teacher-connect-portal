import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen } from "lucide-react";
import { TeachersList } from "./TeachersList";
import { useState } from "react";

export const LandingPage = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple.soft to-white">
      <main>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary/90 to-secondary/90 py-20">
          <div className="absolute inset-0 bg-purple.dark/5 pattern-grid-lg opacity-10"></div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
              <BookOpen className="w-20 h-20 text-white" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                {t("findTeacher")}
              </h1>
              <p className="text-xl text-white/90">
                {t("landingDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* Teachers List Section */}
        <div className="py-12 bg-gradient-to-b from-white to-purple.soft/20">
          <TeachersList initialSearchQuery={searchQuery} />
        </div>
      </main>
    </div>
  );
};