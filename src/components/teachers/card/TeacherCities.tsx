import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin } from "lucide-react";

interface TeacherCitiesProps {
  studentCities: Array<{
    city_name: string;
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
        {studentCities.map((cityData, index) => (
          <Badge
            key={index}
            variant="outline"
            className="bg-accent/10 text-accent border-none"
          >
            {cityData.city_name}
          </Badge>
        ))}
      </div>
    </div>
  );
};