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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("teachingLocations")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {locations.map((location, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{location.location_type}</span>
                <span className="font-semibold">{formatPrice(location.price_per_hour)}/h</span>
              </div>
              {location.location_type === "Teacher's Place" && city && (
                <div className="text-sm text-muted-foreground">
                  {`${getLocalizedName(city)}, ${getLocalizedName(city.region)}`}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};