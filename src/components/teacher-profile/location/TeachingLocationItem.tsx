import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RegionsSection } from "./RegionsSection";
import { type TeachingLocation } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type TeachingLocationItemProps = {
  location: TeachingLocation;
  formData: {
    teachingLocations: TeachingLocation[];
    cityId: string;
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

  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('regions')
          .select('*')
          .order('name_en');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching regions:', error);
        return [];
      }
    },
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities', formData.cityId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cities')
          .select(`
            *,
            region:regions(
              id,
              name_en,
              name_fr,
              name_lb
            )
          `)
          .order('name_en');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
      }
    },
  });

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

  const selectedRegion = regions.find(region => 
    cities.find(city => city.id === formData.cityId)?.region_id === region.id
  );

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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("regions")}</Label>
                <RadioGroup
                  value={selectedRegion?.id || ""}
                  onValueChange={(value) => {
                    // Reset cityId when changing region
                    setFormData({
                      ...formData,
                      cityId: "",
                    });
                  }}
                  className="grid grid-cols-2 gap-2"
                >
                  {regions.map((region) => (
                    <div key={region.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={region.id} id={`region-${region.id}`} />
                      <Label htmlFor={`region-${region.id}`}>{getLocalizedName(region)}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {selectedRegion && (
                <div className="space-y-2">
                  <Label>{t("cities")}</Label>
                  <RadioGroup
                    value={formData.cityId}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        cityId: value,
                      });
                    }}
                    className="grid grid-cols-2 gap-2"
                  >
                    {cities
                      .filter(city => city.region_id === selectedRegion.id)
                      .map((city) => (
                        <div key={city.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={city.id} id={`city-${city.id}`} />
                          <Label htmlFor={`city-${city.id}`}>{getLocalizedName(city)}</Label>
                        </div>
                      ))}
                  </RadioGroup>
                </div>
              )}
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