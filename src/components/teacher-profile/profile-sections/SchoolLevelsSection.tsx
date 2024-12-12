import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap } from "lucide-react";

type SchoolLevelsSectionProps = {
  schoolLevels: string[];
};

export const SchoolLevelsSection = ({ schoolLevels }: SchoolLevelsSectionProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          {t("schoolLevels")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {schoolLevels.map((level, index) => (
            <span 
              key={index} 
              className="bg-primary/10 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              {level}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};