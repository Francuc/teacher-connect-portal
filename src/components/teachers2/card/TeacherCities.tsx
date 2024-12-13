import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin } from "lucide-react";

interface TeacherCitiesProps {
  studentCities: Array<{
    city: {
      id: string;
      name_en: string;
      name_fr: string;
      name_lb: string;
    };
  }>;
  getLocalizedName: (item: any) => string;
}

export const TeacherCities = ({
  studentCities,
  getLocalizedName,
}: TeacherCitiesProps) => {
  const { t } = useLanguage();

  if (!studentCities?.length) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-semibold flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        {t("availableIn")}
      </h4>
      <div className="flex flex-wrap gap-2">
        {studentCities.map((cityData) => (
          <Badge
            key={cityData.city.id}
            variant="outline"
            className="bg-purple-soft text-purple-vivid border-none"
          >
            {getLocalizedName(cityData.city)}
          </Badge>
        ))}
      </div>
    </div>
  );
};