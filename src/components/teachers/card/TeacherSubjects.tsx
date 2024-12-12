import { BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeacherSubjectsProps {
  subjects: any[];
  getLocalizedName: (item: any) => string;
}

export const TeacherSubjects = ({ subjects, getLocalizedName }: TeacherSubjectsProps) => {
  const { t } = useLanguage();

  if (!subjects || subjects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BookOpen className="w-4 h-4" />
        <span>{t("subjects")}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {subjects.slice(0, 3).map((subjectData, index) => (
          <span
            key={`${subjectData.subject_id}-${index}`}
            className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
          >
            {getLocalizedName(subjectData.subject)}
          </span>
        ))}
        {subjects.length > 3 && (
          <span className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary font-medium">
            +{subjects.length - 3}
          </span>
        )}
      </div>
    </div>
  );
};