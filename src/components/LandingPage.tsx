import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Search } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { TeachersList } from "./TeachersList";
import { Input } from "./ui/input";
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
              
              {/* Search Bar */}
              <div className="w-full max-w-2xl mt-8 relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    className="w-full pl-12 pr-4 py-4 text-lg rounded-full border-2 border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-8">
                <LanguageSwitcher />
              </div>
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