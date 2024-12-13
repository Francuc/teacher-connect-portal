import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { TeacherCard2 } from "./TeacherCard2";

interface TeachersGrid2Props {
  teachers: any[];
  isLoading: boolean;
  language: string;
  selectedSubject: string;
}

export const TeachersGrid2 = ({ 
  teachers, 
  isLoading, 
  language,
  selectedSubject 
}: TeachersGrid2Props) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card
            key={index}
            className="h-[400px] animate-pulse bg-muted"
          />
        ))}
      </div>
    );
  }

  if (!teachers?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">{t("noResults")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teachers.map((teacher) => {
        const isDisabled = selectedSubject !== "all" && 
          !teacher.teacher_subjects?.some((s: any) => s.subject?.id === selectedSubject);
        
        return (
          <TeacherCard2
            key={teacher.id}
            teacher={teacher}
            isDisabled={isDisabled}
          />
        );
      })}
    </div>
  );
};