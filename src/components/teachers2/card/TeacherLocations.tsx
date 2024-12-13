import { Badge } from "@/components/ui/badge";
import { MapPin, Euro } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TeachingLocation } from "@/lib/constants";

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
    <div className="space-y-2">
      <h4 className="font-semibold flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4" />
        {t("teachingLocations")}
      </h4>
      <div className="flex flex-col gap-2">
        {locations.map((location, index) => (
          <div 
            key={index}
            className="flex justify-between items-center p-2 rounded-lg bg-primary/10"
          >
            <span className="text-primary">
              {getLocationTypeTranslation(location.location_type)}
            </span>
            <Badge
              variant="outline"
              className="bg-primary text-white border-none flex items-center gap-1"
            >
              <Euro className="w-3 h-3" />
              {formatPrice(location.price_per_hour)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};