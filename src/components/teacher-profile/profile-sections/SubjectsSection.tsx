import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

type SubjectsSectionProps = {
  subjects: string[];
};

export const SubjectsSection = ({ subjects }: SubjectsSectionProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("subjects")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject, index) => (
            <span key={index} className="bg-primary/10 px-2 py-1 rounded">
              {subject}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};