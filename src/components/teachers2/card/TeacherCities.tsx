import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section } from "./Section";
import { SectionHeader } from "./SectionHeader";

interface TeacherCitiesProps {
  cities: Array<{ city_name: string }>;
}

export const TeacherCities = ({ cities }: TeacherCitiesProps) => {
  const { t } = useLanguage();

  if (!cities?.length) return null;

  return (
    <Section>
      <SectionHeader icon={MapPin} title={t("availableIn")} />
      <div className="flex flex-wrap gap-1 mt-1">
        {cities.map((city, index) => (
          <Badge
            key={index}
            variant="outline"
            className="bg-primary/10 text-primary border-none text-xs py-0"
          >
            {city.city_name}
          </Badge>
        ))}
      </div>
    </Section>
  );
};