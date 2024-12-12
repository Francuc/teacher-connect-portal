import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface TeacherLocationsProps {
  teacher: any;
  getLocalizedName: (item: any) => string;
}

export const TeacherLocations = ({ teacher, getLocalizedName }: TeacherLocationsProps) => {
  const { t } = useLanguage();

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*, region:regions(*)');
      if (error) throw error;
      return data;
    }
  });

  const getTranslatedCityName = (cityName: string) => {
    const city = cities.find(c => c.name_en === cityName);
    if (city) {
      return getLocalizedName(city);
    }
    return cityName;
  };

  const studentPlaceLocation = teacher.teacher_locations?.find(
    (loc: any) => loc.location_type === "Student's Place"
  );

  if (!studentPlaceLocation) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>{t("availableIn")}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {teacher.teacher_student_cities?.map((cityData: any) => (
          <span
            key={cityData.id}
            className="text-xs px-3 py-1 rounded-full bg-primary/5 text-primary/90 font-medium"
          >
            {getTranslatedCityName(cityData.city_name)}
          </span>
        ))}
      </div>
    </div>
  );
};