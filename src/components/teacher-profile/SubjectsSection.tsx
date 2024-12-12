import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Book } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type SubjectsSectionProps = {
  formData: {
    subjects: string[];
    schoolLevels: string[];
  };
  setFormData: (data: any) => void;
};

export const SubjectsSection = ({ formData, setFormData }: SubjectsSectionProps) => {
  const { t, language } = useLanguage();
  
  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      console.log('Fetching subjects...');
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name_en, name_fr, name_lb');
      if (error) {
        console.error('Error fetching subjects:', error);
        throw error;
      }
      console.log('Fetched subjects:', data);
      return data || [];
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

  if (isLoading) {
    return <div>Loading subjects...</div>;
  }

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
                    console.log('Subject selection changed:', {
                      subject: subjectName,
                      checked,
                      currentSubjects: formData.subjects
                    });
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
      </CardContent>
    </Card>
  );
};