import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, GraduationCap } from "lucide-react";
import { TeachersList } from "./TeachersList";
import { useState } from "react";
import { useSubjectsData } from "@/hooks/useSubjectsData";
import { useSchoolLevelsData } from "@/hooks/useSchoolLevelsData";

export const LandingPage = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: subjects = [] } = useSubjectsData();
  const { data: schoolLevels = [] } = useSchoolLevelsData();

  const getLocalizedName = (item: { name_en: string; name_fr: string; name_lb: string }) => {
    switch(language) {
      case 'fr':
        return item.name_fr;
      case 'lb':
        return item.name_lb;
      default:
        return item.name_en;
    }
  };

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

        {/* Subjects and Levels Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Subjects */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-purple.dark">{t("subjects")}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="p-4 rounded-xl bg-purple.soft/10 hover:bg-purple.soft/20 transition-colors"
                    >
                      <span className="text-sm font-medium text-purple.dark">
                        {getLocalizedName(subject)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* School Levels */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-purple.dark">{t("schoolLevels")}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {schoolLevels.map((level) => (
                    <div
                      key={level.id}
                      className="p-4 rounded-xl bg-purple.soft/10 hover:bg-purple.soft/20 transition-colors"
                    >
                      <span className="text-sm font-medium text-purple.dark">
                        {getLocalizedName(level)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
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