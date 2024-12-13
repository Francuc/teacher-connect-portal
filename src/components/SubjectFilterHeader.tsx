import { useLanguage } from "@/contexts/LanguageContext";
import { useSubjectFilter } from "@/contexts/SubjectFilterContext";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export const SubjectFilterHeader = () => {
  const { t, language } = useLanguage();
  const { selectedSubject, setSelectedSubject } = useSubjectFilter();

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name_en');
      
      if (error) throw error;
      return data || [];
    }
  });

  const getLocalizedName = (subject: any) => {
    if (!subject) return '';
    return language === 'fr' ? subject.name_fr : 
           language === 'lb' ? subject.name_lb : 
           subject.name_en;
  };

  return (
    <div className="bg-white py-8 border-b border-purple.soft/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-purple.dark mb-6">
          {t("findTeacher")}
        </h1>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple.dark" />
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[200px] h-10 border-purple.soft/30">
              <SelectValue placeholder={t("allSubjects")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allSubjects")}</SelectItem>
              {subjects?.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {getLocalizedName(subject)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};