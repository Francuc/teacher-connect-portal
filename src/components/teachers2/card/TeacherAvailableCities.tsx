import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Section } from "./Section";
import { SectionHeader } from "./SectionHeader";

export interface TeacherAvailableCitiesProps {
  cities: Array<{
    cities: {
      id: string;
      name_en: string;
      name_fr: string;
      name_lb: string;
    };
  }>;
}

export const TeacherAvailableCities = ({ cities }: TeacherAvailableCitiesProps) => {
  const { t, language } = useLanguage();

  const getLocalizedName = (city: { name_en: string; name_fr: string; name_lb: string }) => {
    switch(language) {
      case 'fr':
        return city.name_fr;
      case 'lb':
        return city.name_lb;
      default:
        return city.name_en;
    }
  };

  if (!cities?.length) return null;

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
            {getLocalizedName(cityData.cities)}
          </Badge>
        ))}
      </div>
    </Section>
  );
};