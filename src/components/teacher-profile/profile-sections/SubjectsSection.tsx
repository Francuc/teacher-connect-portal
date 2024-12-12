import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen } from "lucide-react";

type SubjectsSectionProps = {
  subjects: {
    subject: {
      name_en: string;
      name_fr: string;
      name_lb: string;
    };
  }[];
};

export const SubjectsSection = ({ subjects }: SubjectsSectionProps) => {
  const { t, language } = useLanguage();

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          {t("subjects")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {subjects.map((subjectData, index) => (
            <span 
              key={index} 
              className="bg-primary/10 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              {getLocalizedName(subjectData.subject)}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};