import { Badge } from "@/components/ui/badge";
import { MapPin, Euro } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TeachingLocation } from "@/lib/constants";
import { Section } from "./Section";
import { SectionHeader } from "./SectionHeader";

interface TeacherLocationsProps {
  locations: Array<{
    location_type: TeachingLocation;
    price_per_hour: number;
  }>;
}

export const TeacherLocations = ({ locations }: TeacherLocationsProps) => {
  const { t } = useLanguage();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getLocationTypeTranslation = (locationType: TeachingLocation) => {
    switch (locationType) {
      case "Teacher's Place":
        return t("teacherPlace");
      case "Student's Place":
        return t("studentPlace");
      case "Online":
        return t("online");
      default:
        return locationType;
    }
  };

  return (
    <Section>
      <SectionHeader icon={MapPin} title={t("teachingLocations")} />
      <div className="grid grid-cols-2 gap-1.5 mt-1">
        {locations.map((location, index) => (
          <div 
            key={index}
            className="flex justify-between items-center p-1.5 rounded-lg bg-primary/5 text-xs"
          >
            <span className="text-primary truncate mr-1">
              {getLocationTypeTranslation(location.location_type)}
            </span>
            <Badge
              variant="outline"
              className="bg-primary text-white border-none flex items-center gap-0.5 text-[10px] py-0.5 px-1.5"
            >
              <Euro className="w-2.5 h-2.5" />
              {formatPrice(location.price_per_hour)}
            </Badge>
          </div>
        ))}
      </div>
    </Section>
  );
};