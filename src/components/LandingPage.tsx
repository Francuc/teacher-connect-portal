import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, MapPin, Computer } from "lucide-react";
import { TeachersList2 } from "./teachers2/TeachersList2";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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
        {/* Hero Section with animated gradient background */}
        <div className="relative py-24 overflow-hidden bg-gradient-to-r from-primary/95 to-secondary/95 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)] before:animate-[pulse_4s_ease-in-out_infinite]">
          <div className="absolute inset-0 bg-purple.dark/5 pattern-grid-lg opacity-10"></div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
              <div className="p-6 bg-white/10 rounded-full backdrop-blur-sm">
                <BookOpen className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                {t("findTeacher")}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                {t("landingDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* Teachers List Section */}
        <div className="py-8 bg-gradient-to-b from-white to-purple.soft/20">
          {/* Filters Section */}
          <div className="container mx-auto px-4 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Subject Filter */}
              <div className="relative">
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger 
                    className="w-full h-14 text-lg bg-white shadow-lg hover:bg-gray-50 transition-colors border-2 border-purple.soft/30 focus:ring-2 focus:ring-primary/30 focus:border-primary rounded-xl pl-12"
                  >
                    <BookOpen className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/70" />
                    <SelectValue placeholder={t("selectSubject")} />
                  </SelectTrigger>
                  <SelectContent 
                    className="bg-white max-h-[400px] w-[80vw] md:w-[600px]"
                    align="center"
                  >
                    <div className="p-4">
                      <SelectItem 
                        value="all"
                        className="mb-4 h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 text-lg"
                      >
                        {t("allSubjects")}
                      </SelectItem>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {subjects
                          .sort((a, b) => getLocalizedName(a).localeCompare(getLocalizedName(b)))
                          .map((subject) => (
                          <SelectItem 
                            key={subject.id} 
                            value={subject.id}
                            className="h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 flex items-center justify-center text-center px-2"
                          >
                            {getLocalizedName(subject)}
                          </SelectItem>
                        ))}
                      </div>
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {/* City Filter with Online Switch */}
              <div className="relative flex gap-2 items-center">
                <div className="flex-1">
                  <Select
                    value={selectedCity}
                    onValueChange={setSelectedCity}
                  >
                    <SelectTrigger 
                      className="w-full h-14 text-lg bg-white shadow-lg hover:bg-gray-50 transition-colors border-2 border-purple.soft/30 focus:ring-2 focus:ring-primary/30 focus:border-primary rounded-xl pl-12"
                    >
                      <MapPin className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/70" />
                      <SelectValue placeholder={t("selectCity")} />
                    </SelectTrigger>
                    <SelectContent 
                      className="bg-white max-h-[400px] w-[80vw] md:w-[600px]"
                      align="center"
                    >
                      <div className="p-4">
                        <SelectItem 
                          value="all"
                          className="mb-4 h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 text-lg"
                        >
                          {t("allCities")}
                        </SelectItem>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {cities
                            .sort((a, b) => getLocalizedName(a).localeCompare(getLocalizedName(b)))
                            .map((city) => (
                            <SelectItem 
                              key={city.id} 
                              value={city.id}
                              className="h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 flex items-center justify-center text-center px-2"
                            >
                              {getLocalizedName(city)}
                            </SelectItem>
                          ))}
                        </div>
                      </div>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-center h-14 px-4 bg-white shadow-lg rounded-xl border-2 border-purple.soft/30">
                  <Switch
                    id="online-mode"
                    checked={showOnlineOnly}
                    onCheckedChange={setShowOnlineOnly}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Computer className="w-5 h-5 ml-2 text-primary/70" />
                </div>
              </div>
            </div>
          </div>

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
