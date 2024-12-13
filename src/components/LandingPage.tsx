import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen } from "lucide-react";
import { TeachersList2 } from "./teachers2/TeachersList2";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const LandingPage = () => {
  const { t, language } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

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
        <div className="relative bg-gradient-to-r from-primary/95 to-secondary/95 py-24">
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
          <TeachersList2 selectedSubject={selectedSubject} />
        </div>

        {/* Subject Filter Section - Moved to bottom */}
        <div className="container mx-auto px-4 py-12 bg-white/80 backdrop-blur-sm border-t border-purple.soft/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-purple.dark text-center mb-6">
              {t("filterBySubject")}
            </h2>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger 
                className="w-full h-16 text-lg bg-white shadow-lg hover:bg-gray-50 transition-colors border-2 border-purple.soft/30 focus:ring-2 focus:ring-primary/30 focus:border-primary rounded-xl"
              >
                <SelectValue placeholder={t("selectSubject")} />
              </SelectTrigger>
              <SelectContent 
                className="bg-white max-h-[400px]"
                align="center"
              >
                <div className="p-4">
                  <SelectItem 
                    value="all"
                    className="mb-4 h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20 text-lg"
                  >
                    {t("allSubjects")}
                  </SelectItem>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {subjects.map((subject) => (
                      <SelectItem 
                        key={subject.id} 
                        value={subject.id}
                        className="h-12 hover:bg-primary/10 rounded-lg data-[state=checked]:bg-primary/20"
                      >
                        {getLocalizedName(subject)}
                      </SelectItem>
                    ))}
                  </div>
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>
      </main>
    </div>
  );
};