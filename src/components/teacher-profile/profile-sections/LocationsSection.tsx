import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin } from "lucide-react";
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
  studentRegions: string[];
  studentCities: string[];
};

export const LocationsSection = ({ 
  locations, 
  city, 
  studentRegions,
  studentCities 
}: LocationsSectionProps) => {
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
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {t("teachingLocations")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {locations.map((location, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-lg">{location.location_type}</span>
                <span className="font-semibold bg-primary/10 px-3 py-1.5 rounded-full">
                  {formatPrice(location.price_per_hour)}/h
                </span>
              </div>
              {location.location_type === "Teacher's Place" && city && (
                <div className="text-muted-foreground">
                  {`${getLocalizedName(city)}, ${getLocalizedName(city.region)}`}
                </div>
              )}
              {location.location_type === "Student's Place" && (
                <div className="space-y-2">
                  {studentRegions.length > 0 && (
                    <div className="text-muted-foreground">
                      <span className="font-medium text-foreground">{t("regions")}: </span>
                      {studentRegions.join(", ")}
                    </div>
                  )}
                  {studentCities.length > 0 && (
                    <div className="text-muted-foreground">
                      <span className="font-medium text-foreground">{t("cities")}: </span>
                      {studentCities.join(", ")}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};