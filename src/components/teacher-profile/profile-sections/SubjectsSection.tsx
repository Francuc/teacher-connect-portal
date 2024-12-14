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
    <Card className="bg-white shadow-sm">
      <CardHeader className="border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-lg text-purple-dark">
          <BookOpen className="w-5 h-5 text-primary" />
          {t("subjects")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2">
          {subjects.map((subjectData, index) => (
            <span 
              key={index} 
              className="px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary"
            >
              {getLocalizedName(subjectData.subject)}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};