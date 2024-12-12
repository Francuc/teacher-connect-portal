import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type SchoolLevelsSectionProps = {
  schoolLevels: string[];
  onSchoolLevelsChange?: (levels: string[]) => void;
  isEditing?: boolean;
};

export const SchoolLevelsSection = ({ 
  schoolLevels,
  onSchoolLevelsChange,
  isEditing = false 
}: SchoolLevelsSectionProps) => {
  const { t, language } = useLanguage();

  const { data: availableLevels } = useQuery({
    queryKey: ['schoolLevels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_levels')
        .select('*')
        .order('name_en');
      
      if (error) throw error;
      return data;
    },
  });

  const getLocalizedName = (level: { name_en: string; name_fr: string; name_lb: string }) => {
    switch(language) {
      case 'fr':
        return level.name_fr;
      case 'lb':
        return level.name_lb;
      default:
        return level.name_en;
    }
  };

  const handleLevelToggle = (levelName: string) => {
    if (!onSchoolLevelsChange) return;

    const isSelected = schoolLevels.includes(levelName);
    let updatedLevels;

    if (isSelected) {
      updatedLevels = schoolLevels.filter(level => level !== levelName);
    } else {
      updatedLevels = [...schoolLevels, levelName];
    }

    onSchoolLevelsChange(updatedLevels);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="px-6 py-4 border-b">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <GraduationCap className="w-5 h-5" />
          {t("schoolLevels")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableLevels?.map((level) => (
              <div key={level.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`level-${level.id}`}
                  checked={schoolLevels.includes(level.name_en)}
                  onCheckedChange={() => handleLevelToggle(level.name_en)}
                />
                <Label htmlFor={`level-${level.id}`}>
                  {getLocalizedName(level)}
                </Label>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};