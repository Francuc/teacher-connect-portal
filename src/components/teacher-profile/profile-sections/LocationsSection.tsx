import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { TeachingLocation } from "@/lib/constants";

type LocationsSectionProps = {
  locations: {
    location_type: TeachingLocation;
    price_per_hour: number;
  }[];
  city: {
    name_en: string;
    name_fr: string;
    name_lb: string;
    region: {
      name_en: string;
      name_fr: string;
      name_lb: string;
    };
  } | null;
};

export const LocationsSection = ({ locations, city }: LocationsSectionProps) => {
  const { t, language } = useLanguage();

  const getLocalizedName = (item: any) => {
    if (!item) return '';
    switch(language) {
      case 'fr':
        return item.name_fr;
      case 'lb':
        return item.name_lb;
      default:
        return item.name_en;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("teachingLocations")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {locations.map((location, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{location.location_type}</span>
              <span className="font-semibold">€{location.price_per_hour}/h</span>
            </div>
          ))}
          {city && (
            <div>
              <h3 className="font-semibold">{t("teacherLocation")}</h3>
              <p>{`${getLocalizedName(city)}, ${getLocalizedName(city.region)}`}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};