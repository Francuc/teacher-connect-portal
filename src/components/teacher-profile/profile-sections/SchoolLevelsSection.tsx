import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap } from "lucide-react";

type SchoolLevelsSectionProps = {
  schoolLevels: string[];
};

export const SchoolLevelsSection = ({ schoolLevels }: SchoolLevelsSectionProps) => {
  const { t } = useLanguage();

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-lg text-purple-dark">
          <GraduationCap className="w-5 h-5 text-primary" />
          {t("schoolLevels")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2">
          {schoolLevels.map((level, index) => (
            <span 
              key={index} 
              className="px-4 py-2 rounded-full text-sm font-medium bg-secondary/10 text-secondary"
            >
              {level}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};