import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DollarSign, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RegionsSection } from "./RegionsSection";
import { type TeachingLocation } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";

type TeachingLocationItemProps = {
  location: TeachingLocation;
  formData: {
    teachingLocations: TeachingLocation[];
    teacherCity: string;
    studentRegions: string[];
    studentCities: string[];
    pricePerHour: {
      teacherPlace: string;
      studentPlace: string;
      online: string;
    };
  };
  setFormData: (data: any) => void;
};

export const TeachingLocationItem = ({
  location,
  formData,
  setFormData,
}: TeachingLocationItemProps) => {
  const { t, language } = useLanguage();

  const { data: cities = [], isLoading, error } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .order('name_en');
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
      }
    },
    initialData: [],
  });

  const getLocalizedName = (city: any) => {
    if (!city) return '';
    switch(language) {
      case 'fr':
        return city.name_fr;
      case 'lb':
        return city.name_lb;
      default:
        return city.name_en;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={location}
          checked={formData.teachingLocations.includes(location)}
          onCheckedChange={(checked) => {
            setFormData({
              ...formData,
              teachingLocations: checked
                ? [...formData.teachingLocations, location]
                : formData.teachingLocations.filter((l) => l !== location),
            });
          }}
        />
        <Label htmlFor={location}>{location}</Label>
      </div>

      {formData.teachingLocations.includes(location) && (
        <div className="space-y-2 pl-6">
          {location === "Teacher's Place" && (
            <div className="space-y-2">
              <Label>{t("city")}</Label>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="text-sm text-destructive text-center">
                    {t("errorLoadingCities")}
                  </div>
                ) : cities.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center">
                    {t("noCitiesAvailable")}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {cities.map((city) => (
                      <div key={city.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`city-${city.id}`}
                          checked={formData.teacherCity === getLocalizedName(city)}
                          onCheckedChange={(checked) => {
                            setFormData({
                              ...formData,
                              teacherCity: checked ? getLocalizedName(city) : "",
                            });
                          }}
                        />
                        <Label htmlFor={`city-${city.id}`}>{getLocalizedName(city)}</Label>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}

          {location === "Student's Place" && (
            <RegionsSection formData={formData} setFormData={setFormData} />
          )}

          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <Input
              type="number"
              placeholder={t("pricePerHour")}
              value={
                formData.pricePerHour[
                  location.toLowerCase().replace("'s", "").split(" ")[0] as keyof typeof formData.pricePerHour
                ]
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricePerHour: {
                    ...formData.pricePerHour,
                    [location.toLowerCase().replace("'s", "").split(" ")[0]]: e.target.value,
                  },
                })
              }
              className="w-32"
            />
          </div>
        </div>
      )}
    </div>
  );
};