import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TeacherSubject } from "./form/types";

interface SubjectsSectionProps {
  subjects: TeacherSubject[];
  onSubjectsChange?: (subjects: TeacherSubject[]) => void;
  isEditing?: boolean;
}

export const SubjectsSection = ({ 
  subjects,
  onSubjectsChange,
  isEditing = false 
}: SubjectsSectionProps) => {
  const { t, language } = useLanguage();

  const { data: availableSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name_en');
      
      if (error) throw error;
      console.log('Available subjects:', data);
      return data;
    },
  });

  console.log('Current subjects prop:', subjects);

  const getLocalizedName = (subject: { name_en: string; name_fr: string; name_lb: string } | null | undefined) => {
    if (!subject) {
      console.log('Subject is null or undefined');
      return '';
    }
    
    console.log('Getting localized name for subject:', subject, 'with language:', language);
    
    switch(language) {
      case 'fr':
        return subject.name_fr;
      case 'lb':
        return subject.name_lb;
      default:
        return subject.name_en;
    }
  };

  const handleSubjectToggle = (subjectId: string, subject: any) => {
    if (!onSubjectsChange) return;

    const isSelected = subjects.some(s => s.subject_id === subjectId);
    let updatedSubjects;

    if (isSelected) {
      updatedSubjects = subjects.filter(s => s.subject_id !== subjectId);
    } else {
      updatedSubjects = [...subjects, {
        subject_id: subjectId,
        subject: {
          id: subject.id,
          name_en: subject.name_en,
          name_fr: subject.name_fr,
          name_lb: subject.name_lb
        }
      }];
    }

    onSubjectsChange(updatedSubjects);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          {t("subjects")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSubjects?.map((subject) => (
              <div key={subject.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`subject-${subject.id}`}
                  checked={subjects.some(s => s.subject_id === subject.id)}
                  onCheckedChange={() => handleSubjectToggle(subject.id, subject)}
                />
                <Label htmlFor={`subject-${subject.id}`}>
                  {getLocalizedName(subject)}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {subjects.map((subjectData) => {
              console.log('Rendering subject:', subjectData);
              return (
                <span 
                  key={subjectData.subject_id} 
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-soft text-purple-vivid"
                >
                  {getLocalizedName(subjectData.subject)}
                </span>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};