import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen } from "lucide-react";
import { TeachersList2 } from "./teachers2/TeachersList2";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchFilters } from "./landing/SearchFilters";

export const LandingPage = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const cityFromUrl = searchParams.get('city');
  
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>(cityFromUrl || "all");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Update selected city when URL parameter changes
  useEffect(() => {
    if (cityFromUrl) {
      setSelectedCity(cityFromUrl);
    }
  }, [cityFromUrl]);

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name_en');
      if (error) throw error;
      return data;
    }
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name_en');
      if (error) throw error;
      return data;
    }
  });

  const getLocalizedName = (item: any) => {
    if (!item) return '';
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
        <div className="relative py-16 overflow-hidden bg-gradient-to-r from-primary/95 to-secondary/95">
          <div className="absolute inset-0 bg-purple.dark/5 pattern-grid-lg opacity-10"></div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                {t("findTeacher")}
              </h1>
              <p className="text-base md:text-lg text-white/90 max-w-xl">
                {t("landingDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* Teachers List Section */}
        <div className="py-8 bg-gradient-to-b from-white to-purple.soft/20">
          <SearchFilters
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            showOnlineOnly={showOnlineOnly}
            setShowOnlineOnly={setShowOnlineOnly}
            subjects={subjects}
            cities={cities}
            getLocalizedName={getLocalizedName}
          />

          <TeachersList2 
            selectedSubject={selectedSubject} 
            selectedCity={selectedCity}
            showOnlineOnly={showOnlineOnly}
          />
        </div>
      </main>
    </div>
  );
};