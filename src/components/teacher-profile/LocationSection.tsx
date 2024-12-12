import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, DollarSign } from "lucide-react";
import { TEACHING_LOCATIONS, type TeachingLocation } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type LocationSectionProps = {
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

export const LocationSection = ({ formData, setFormData }: LocationSectionProps) => {
  const { t, language } = useLanguage();

  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regions')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities', formData.studentRegions],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .in('region_id', formData.studentRegions.map(region => 
          regions.find(r => getLocalizedName(r) === region)?.id
        ));
      if (error) throw error;
      return data;
    },
    enabled: formData.studentRegions.length > 0
  });

  const getLocalizedName = (item: any) => {
    switch(language) {
      case 'fr':
        return item.name_fr;
      case 'lb':
        return item.name_lb;
      default:
        return item.name_en;
    }
  };

  const handleRegionChange = (region: any, checked: boolean) => {
    const regionName = getLocalizedName(region);
    const newRegions = checked
      ? [...formData.studentRegions, regionName]
      : formData.studentRegions.filter((r) => r !== regionName);
    
    // When a region is unselected, remove its cities
    const regionCities = cities
      .filter(city => city.region_id === region.id)
      .map(city => getLocalizedName(city));
    
    const newCities = checked
      ? [...formData.studentCities, ...regionCities]
      : formData.studentCities.filter(city => !regionCities.includes(city));

    setFormData({
      ...formData,
      studentRegions: newRegions,
      studentCities: newCities,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {t("teachingLocations")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEACHING_LOCATIONS.map((location) => (
            <div key={location} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={location}
                  checked={formData.teachingLocations.includes(location)}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      teachingLocations: checked
                        ? [...formData.teachingLocations, location]
                        : formData.teachingLocations.filter(
                            (l) => l !== location
                          ),
                    });
                  }}
                />
                <Label htmlFor={location}>{location}</Label>
              </div>
              
              {formData.teachingLocations.includes(location) && (
                <div className="space-y-2 pl-6">
                  {location === "Teacher's Place" && (
                    <div className="space-y-2">
                      <Label htmlFor="teacherCity">{t("city")}</Label>
                      <Input
                        id="teacherCity"
                        value={formData.teacherCity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            teacherCity: e.target.value,
                          })
                        }
                        placeholder={t("enterCity")}
                      />
                    </div>
                  )}

                  {location === "Student's Place" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t("regions")}</Label>
                        {regions.map((region) => (
                          <div key={region.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`region-${region.id}`}
                              checked={formData.studentRegions.includes(getLocalizedName(region))}
                              onCheckedChange={(checked) =>
                                handleRegionChange(region, checked as boolean)
                              }
                            />
                            <Label htmlFor={`region-${region.id}`}>{getLocalizedName(region)}</Label>
                          </div>
                        ))}
                      </div>

                      {formData.studentRegions.length > 0 && (
                        <div className="space-y-2">
                          <Label>{t("cities")}</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {cities.map((city) => (
                              <div key={city.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`city-${city.id}`}
                                  checked={formData.studentCities.includes(getLocalizedName(city))}
                                  onCheckedChange={(checked) =>
                                    setFormData({
                                      ...formData,
                                      studentCities: checked
                                        ? [...formData.studentCities, getLocalizedName(city)]
                                        : formData.studentCities.filter(
                                            (c) => c !== getLocalizedName(city)
                                          ),
                                    })
                                  }
                                />
                                <Label htmlFor={`city-${city.id}`}>{getLocalizedName(city)}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
                            [location
                              .toLowerCase()
                              .replace("'s", "")
                              .split(" ")[0]]: e.target.value,
                          },
                        })
                      }
                      className="w-32"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};