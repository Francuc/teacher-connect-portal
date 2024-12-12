import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

type SchoolLevelsSectionProps = {
  schoolLevels: string[];
};

export const SchoolLevelsSection = ({ schoolLevels }: SchoolLevelsSectionProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("schoolLevels")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {schoolLevels.map((level, index) => (
            <span key={index} className="bg-primary/10 px-2 py-1 rounded">
              {level}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};