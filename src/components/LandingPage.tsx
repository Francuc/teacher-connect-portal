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
              <div className="w-full max-w-xs">
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={t("selectSubject")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allSubjects")}</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {getLocalizedName(subject)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers List Section */}
        <div className="py-16 bg-gradient-to-b from-white to-purple.soft/20">
          <TeachersList2 selectedSubject={selectedSubject} />
        </div>
      </main>
    </div>
  );
};