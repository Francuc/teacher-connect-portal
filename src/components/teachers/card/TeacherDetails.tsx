import { useLanguage } from "@/contexts/LanguageContext";
import { Euro } from "lucide-react";

interface TeacherDetailsProps {
  teacher: any;
  getLocalizedName: (item: any) => string;
  formatPrice: (price: number) => string;
}

export const TeacherDetails = ({ 
  teacher, 
  getLocalizedName,
  formatPrice 
}: TeacherDetailsProps) => {
  const { t } = useLanguage();

  return (
    <div className="mt-4 space-y-4 text-sm">
      {/* Bio Section */}
      {teacher.bio && (
        <div>
          <h4 className="font-semibold mb-2">{t("biography")}</h4>
          <p className="text-muted-foreground line-clamp-3">{teacher.bio}</p>
        </div>
      )}

      {/* Teaching Locations and Prices */}
      <div>
        <h4 className="font-semibold mb-2">{t("teachingLocations")}</h4>
        <div className="space-y-2">
          {teacher.teacher_locations?.map((location: any) => (
            <div key={location.id} className="flex justify-between items-center">
              <span>{location.location_type}</span>
              <div className="flex items-center gap-1">
                <Euro className="w-4 h-4" />
                <span className="font-medium">
                  {formatPrice(location.price_per_hour)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Cities */}
      {teacher.teacher_student_cities?.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">{t("availableIn")}</h4>
          <div className="flex flex-wrap gap-2">
            {teacher.teacher_student_cities.map((cityData: any) => (
              <span
                key={cityData.id}
                className="text-xs px-3 py-1 rounded-full bg-primary/5 text-primary/90 font-medium"
              >
                {cityData.city_name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};