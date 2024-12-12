import { GraduationCap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface TeacherLevelsProps {
  levels: { school_level: string }[];
}

export const TeacherLevels = ({ levels }: TeacherLevelsProps) => {
  const { t, language } = useLanguage();

  const { data: schoolLevels = [] } = useQuery({
    queryKey: ['schoolLevels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_levels')
        .select('*')
        .order('name_en');
      if (error) throw error;
      return data;
    }
  });

  const getTranslatedLevel = (levelName: string) => {
    const level = schoolLevels.find(l => l.name_en === levelName);
    if (level) {
      switch(language) {
        case 'fr':
          return level.name_fr;
        case 'lb':
          return level.name_lb;
        default:
          return level.name_en;
      }
    }
    return levelName;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <GraduationCap className="w-4 h-4" />
        <span>{t("schoolLevels")}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {levels?.map((level: any) => (
          <span
            key={level.school_level}
            className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium"
          >
            {getTranslatedLevel(level.school_level)}
          </span>
        ))}
      </div>
    </div>
  );
};