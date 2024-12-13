import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen } from "lucide-react";

interface TeachersFilterRowProps {
  onCityChange: (cityId: string) => void;
  onSubjectChange: (subjectId: string) => void;
}

export const TeachersFilterRow = ({ onCityChange, onSubjectChange }: TeachersFilterRowProps) => {
  const { t, language } = useLanguage();

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name_en');
      
      if (error) throw error;
      return data || [];
    },
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
    <div className="w-full bg-white border border-purple-soft/30 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-purple-dark flex items-center gap-2">
            <Search className="w-4 h-4" />
            {t("city")}
          </label>
          <Input 
            type="text"
            placeholder={t("searchCity")}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full border-purple-soft/30 focus:border-primary focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-purple-dark flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t("subjects")}
          </label>
          <Select onValueChange={onSubjectChange}>
            <SelectTrigger className="w-full border-purple-soft/30">
              <SelectValue placeholder={t("allSubjects")} />
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
  );
};