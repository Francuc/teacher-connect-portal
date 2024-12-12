import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { type TeachingLocation } from "@/lib/constants";

type CitiesListProps = {
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

export const CitiesList = ({ formData, setFormData }: CitiesListProps) => {
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

  const { data: cities = [], isLoading } = useQuery({
    queryKey: ['cities', formData.studentRegions],
    queryFn: async () => {
      if (formData.studentRegions.length === 0) return [];
      
      const regionIds = regions
        .filter(region => formData.studentRegions.includes(getLocalizedName(region)))
        .map(region => region.id);

      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .in('region_id', regionIds);
        
      if (error) throw error;
      return data || [];
    },
    enabled: formData.studentRegions.length > 0 && regions.length > 0
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

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return (
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
  );
};