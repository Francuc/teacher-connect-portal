import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export const SubjectsFooter = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const { data: subjects } = useQuery({
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

  const getLocalizedName = (subject: { name_en: string; name_fr: string; name_lb: string }) => {
    switch(language) {
      case 'fr':
        return subject.name_fr;
      case 'lb':
        return subject.name_lb;
      default:
        return subject.name_en;
    }
  };

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/?subject=${subjectId}`);
  };

  return (
    <footer className="bg-white border-t border-purple.soft/30 py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {subjects?.map((subject) => (
            <button
              key={subject.id}
              onClick={() => handleSubjectClick(subject.id)}
              className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
            >
              {getLocalizedName(subject)}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};