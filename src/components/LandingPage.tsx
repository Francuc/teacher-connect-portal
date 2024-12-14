import { useLanguage } from "@/contexts/LanguageContext";
import { TeachersList2 } from "./teachers2/TeachersList2";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { HeroSection } from "./landing/HeroSection";
import { FilterSection } from "./landing/FilterSection";

export const LandingPage = () => {
  const { language } = useLanguage();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple.soft via-white to-purple.soft/20">
      <main>
        <HeroSection />

        {/* Teachers List Section */}
        <div className="py-8 bg-gradient-to-b from-white to-purple.soft/20">
          <FilterSection 
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            showOnlineOnly={showOnlineOnly}
            setShowOnlineOnly={setShowOnlineOnly}
            subjects={subjects}
            cities={cities}
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