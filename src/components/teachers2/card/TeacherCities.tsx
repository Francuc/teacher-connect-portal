import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section } from "./Section";
import { SectionHeader } from "./SectionHeader";

interface TeacherCitiesProps {
  cities: Array<{
    city_name: string;
  }>;
  getTranslatedCityName: (cityName: string) => string;
}

export const TeacherCities = ({ cities, getTranslatedCityName }: TeacherCitiesProps) => {
  const { t } = useLanguage();

  if (!cities || cities.length === 0) return null;

  return (
    <Section>
      <SectionHeader icon={MapPin} title={t("availableIn")} />
      <div className="flex flex-wrap gap-1 mt-1">
        {cities.map((cityData, index) => (
          <Badge
            key={index}
            variant="outline"
            className="bg-primary/10 text-primary border-none text-xs py-0"
          >
            {getTranslatedCityName(cityData.city_name)}
          </Badge>
        ))}
      </div>
    </Section>
  );
};