import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeacherLocationsProps {
  teacher: any;
  getLocalizedName: (item: any) => string;
}

export const TeacherLocations = ({ teacher, getLocalizedName }: TeacherLocationsProps) => {
  const { t } = useLanguage();

  // Add null check for teacher_student_cities
  const studentCities = teacher.teacher_student_cities || [];
  const hasStudentCities = studentCities.length > 0;

  // Add null check for teacher_locations
  const studentPlaceLocation = teacher.teacher_locations?.find(
    (loc: any) => loc.location_type === "Student's Place"
  );

  if (!studentPlaceLocation || !hasStudentCities) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>{t("availableIn")}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {studentCities.map((cityData: any) => (
          <span
            key={cityData.id}
            className="text-xs px-3 py-1 rounded-full bg-primary/5 text-primary/90 font-medium"
          >
            {cityData.city_name}
          </span>
        ))}
      </div>
    </div>
  );
};