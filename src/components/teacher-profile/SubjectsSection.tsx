import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Book } from "lucide-react";
import { type Subject, type SchoolLevel } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type SubjectsSectionProps = {
  formData: {
    subjects: Subject[];
    schoolLevels: SchoolLevel[];
  };
  setFormData: (data: any) => void;
};

export const SubjectsSection = ({ formData, setFormData }: SubjectsSectionProps) => {
  const { t, language } = useLanguage();
  
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: schoolLevels = [] } = useQuery({
    queryKey: ['schoolLevels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_levels')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const getLocalizedName = (item: any) => {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="w-5 h-5" />
          {t("subjects")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t("subjects")}</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center space-x-2">
                <Checkbox
                  id={subject.id}
                  checked={formData.subjects.includes(getLocalizedName(subject))}
                  onCheckedChange={(checked) => {
                    const subjectName = getLocalizedName(subject);
                    setFormData({
                      ...formData,
                      subjects: checked
                        ? [...formData.subjects, subjectName]
                        : formData.subjects.filter((s) => s !== subjectName),
                    });
                  }}
                />
                <Label htmlFor={subject.id}>{getLocalizedName(subject)}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("schoolLevels")}</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {schoolLevels.map((level) => (
              <div key={level.id} className="flex items-center space-x-2">
                <Checkbox
                  id={level.id}
                  checked={formData.schoolLevels.includes(getLocalizedName(level))}
                  onCheckedChange={(checked) => {
                    const levelName = getLocalizedName(level);
                    setFormData({
                      ...formData,
                      schoolLevels: checked
                        ? [...formData.schoolLevels, levelName]
                        : formData.schoolLevels.filter((l) => l !== levelName),
                    });
                  }}
                />
                <Label htmlFor={level.id}>{getLocalizedName(level)}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};