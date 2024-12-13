import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Euro } from "lucide-react";
import { TranslationKey } from "@/lib/i18n/translations";

interface TeacherLocationsProps {
  locations: Array<{
    location_type: TranslationKey;
    price_per_hour: number;
  }>;
  getLocalizedName: (item: any) => string;
  formatPrice: (price: number) => string;
}

export const TeacherLocations = ({
  locations,
  getLocalizedName,
  formatPrice,
}: TeacherLocationsProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <h4 className="font-semibold flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        {t("teachingLocations")}
      </h4>
      <div className="flex flex-wrap gap-2">
        {locations.map((location, index) => (
          <Badge
            key={index}
            variant="outline"
            className="bg-primary/10 text-primary border-none flex items-center gap-2"
          >
            <span>{t(location.location_type as TranslationKey)}</span>
            <span className="font-semibold flex items-center">
              <Euro className="w-3 h-3 mr-1" />
              {formatPrice(location.price_per_hour)}
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
};