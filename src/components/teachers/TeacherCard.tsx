import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { TeacherSubjects } from "./card/TeacherSubjects";
import { TeacherLevels } from "./card/TeacherLevels";
import { TeacherContact } from "./card/TeacherContact";
import { TeacherLocations } from "./card/TeacherLocations";
import { TeacherCities } from "./card/TeacherCities";

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

  const profilePictureUrl = teacher.profile_picture_url 
    ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-pictures/${teacher.profile_picture_url}`
    : null;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <div className="p-6 flex flex-col h-full space-y-4">
        {/* Header Section with Profile Picture and Basic Info */}
        <div className="flex items-start gap-4">
          <Avatar className="w-24 h-24 rounded-xl border-4 border-purple-soft">
            {profilePictureUrl ? (
              <AvatarImage 
                src={profilePictureUrl}
                alt={`${teacher.first_name} ${teacher.last_name}`}
                className="aspect-square h-full w-full object-cover"
              />
            ) : (
              <AvatarFallback className="bg-purple-soft">
                <User className="w-12 h-12 text-purple-vivid" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-purple-dark">
              {teacher.first_name} {teacher.last_name}
            </h3>
            
            {/* Location Information */}
            {teacher.city && (
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>
                  {getLocalizedName(teacher.city)}, {getLocalizedName(teacher.city.region)}
                </span>
              </div>
            )}
            
            {/* Contact Information */}
            <TeacherContact
              email={teacher.email}
              phone={teacher.phone}
              showEmail={teacher.show_email}
              showPhone={teacher.show_phone}
              showFacebook={teacher.show_facebook}
              facebookProfile={teacher.facebook_profile}
            />
          </div>
        </div>

        <Separator />

        {/* Bio Section */}
        {teacher.bio && (
          <div>
            <h4 className="font-semibold mb-2">{t("biography")}</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">{teacher.bio}</p>
          </div>
        )}

        {/* Teaching Locations and Prices */}
        {teacher.teacher_locations && teacher.teacher_locations.length > 0 && (
          <TeacherLocations
            locations={teacher.teacher_locations}
            getLocalizedName={getLocalizedName}
            formatPrice={formatPrice}
          />
        )}

        {/* Subjects Section */}
        {teacher.teacher_subjects && teacher.teacher_subjects.length > 0 && (
          <TeacherSubjects
            subjects={teacher.teacher_subjects}
            getLocalizedName={getLocalizedName}
          />
        )}

        {/* School Levels Section */}
        {teacher.teacher_school_levels && teacher.teacher_school_levels.length > 0 && (
          <TeacherLevels
            levels={teacher.teacher_school_levels}
          />
        )}

        {/* Student Cities */}
        {teacher.teacher_student_cities && teacher.teacher_student_cities.length > 0 && (
          <TeacherCities
            studentCities={teacher.teacher_student_cities}
            getLocalizedName={getLocalizedName}
          />
        )}

        {/* View Profile Button */}
        <div className="mt-auto pt-4 border-t flex justify-end">
          <Button 
            onClick={() => navigate(`/profile/${teacher.user_id}`)}
            className="bg-purple-vivid hover:bg-purple-vivid/90 text-white"
          >
            {t("viewProfile")}
          </Button>
        </div>
      </div>
    </Card>
  );
};