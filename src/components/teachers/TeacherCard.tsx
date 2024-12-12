import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Euro } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TeacherHeader } from "./card/TeacherHeader";
import { TeacherSubjects } from "./card/TeacherSubjects";
import { TeacherLevels } from "./card/TeacherLevels";
import { TeacherLocations } from "./card/TeacherLocations";

interface TeacherCardProps {
  teacher: any;
  getLocalizedName: (item: any) => string;
  getTeacherLocation: (teacher: any) => string;
  getLowestPrice: (locations: any[]) => number | null;
  formatPrice: (price: number) => string;
}

export const TeacherCard = ({
  teacher,
  getLocalizedName,
  getTeacherLocation,
  getLowestPrice,
  formatPrice,
}: TeacherCardProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const lowestPrice = getLowestPrice(teacher.teacher_locations);

  return (
    <Card className="flex flex-col h-full">
      <div className="p-6 flex flex-col h-full">
        <TeacherHeader 
          teacher={teacher}
          getTeacherLocation={getTeacherLocation}
        />

        <div className="flex-grow space-y-4">
          {teacher.teacher_subjects && teacher.teacher_subjects.length > 0 && (
            <TeacherSubjects 
              subjects={teacher.teacher_subjects}
              getLocalizedName={getLocalizedName}
            />
          )}

          {teacher.teacher_school_levels && teacher.teacher_school_levels.length > 0 && (
            <TeacherLevels 
              levels={teacher.teacher_school_levels}
            />
          )}

          <TeacherLocations 
            teacher={teacher}
            getLocalizedName={getLocalizedName}
          />
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t">
          {lowestPrice && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Euro className="w-4 h-4" />
              <span>
                {t("startingFrom")} 
                <span className="font-semibold text-purple-dark ml-1">
                  {formatPrice(lowestPrice)}
                </span>
              </span>
            </div>
          )}
          <Button 
            onClick={() => navigate(`/profile/${teacher.user_id}`)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {t("viewProfile")}
          </Button>
        </div>
      </div>
    </Card>
  );
};