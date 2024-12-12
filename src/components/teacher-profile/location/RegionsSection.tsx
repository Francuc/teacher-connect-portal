import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CitiesList } from "./CitiesList";
import { type TeachingLocation } from "@/lib/constants";

type RegionsSectionProps = {
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

export const RegionsSection = ({ formData, setFormData }: RegionsSectionProps) => {
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

    setFormData({
      ...formData,
      studentRegions: newRegions,
    });
  };

  return (
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
        <CitiesList formData={formData} setFormData={setFormData} />
      )}
    </div>
  );
};