import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, Book, GraduationCap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { TeacherLocations } from "./card/TeacherLocations";
import { TeacherContactInfo } from "./card/TeacherContactInfo";
import { TeacherCities } from "./card/TeacherCities";
import { Section } from "./card/Section";
import { SectionHeader } from "./card/SectionHeader";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface TeacherCard2Props {
  teacher: any;
}

export const TeacherCard2 = ({ teacher }: TeacherCard2Props) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

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

  const handleCardClick = () => {
    window.scrollTo(0, 0);
    navigate(`/profile/${teacher.user_id}`);
  };

  return (
    <Card 
      className="p-3 flex flex-col h-[472px] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-primary/50"
      onClick={handleCardClick}
    >
      {/* Header Section */}
      <div className="h-[89px] flex items-start gap-3 mb-2">
        <Avatar className="w-[100px] h-[100px] rounded-xl border-2 border-purple-soft">
          {teacher.profile_picture_url ? (
            <AvatarImage 
              src={teacher.profile_picture_url}
              alt={`${teacher.first_name} ${teacher.last_name}`}
              className="aspect-square h-full w-full object-cover"
            />
          ) : (
            <AvatarFallback className="bg-primary/5">
              <User className="w-12 h-12 text-primary/50" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-purple-dark truncate">
            {teacher.first_name} {teacher.last_name}
          </h3>
          <TeacherContactInfo
            email={teacher.email}
            phone={teacher.phone}
            facebookProfile={teacher.facebook_profile}
            showEmail={teacher.show_email}
            showPhone={teacher.show_phone}
            showFacebook={teacher.show_facebook}
          />
        </div>
      </div>

      <Separator className="my-2" />

      <div className="grid grid-cols-1 gap-3 flex-1">
        {/* Subjects Section */}
        <Section>
          <SectionHeader icon={Book} title={t("subjects")} />
          <div className="flex flex-wrap gap-1 mt-1">
            {teacher.teacher_subjects?.map((subjectData: any) => (
              <Badge
                key={subjectData.subject.id}
                variant="outline"
                className="bg-primary/10 text-primary border-none text-xs py-0"
              >
                {getLocalizedName(subjectData.subject)}
              </Badge>
            ))}
          </div>
        </Section>

        {/* School Levels Section */}
        <Section>
          <SectionHeader icon={GraduationCap} title={t("schoolLevels")} />
          <div className="flex flex-wrap gap-1 mt-1">
            {teacher.teacher_school_levels?.map((level: any, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-primary/10 text-primary border-none text-xs py-0"
              >
                {level.school_level}
              </Badge>
            ))}
          </div>
        </Section>

        {/* Cities Section */}
        {teacher.teacher_student_cities && teacher.teacher_student_cities.length > 0 && (
          <Section>
            <SectionHeader icon={MapPin} title={t("availableIn")} />
            <div className="flex flex-wrap gap-1 mt-1">
              {teacher.teacher_student_cities.map((city: any, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-primary/10 text-primary border-none text-xs py-0"
                >
                  {city.city_name}
                </Badge>
              ))}
            </div>
          </Section>
        )}

        {/* Teaching Locations Section */}
        {teacher.teacher_locations && teacher.teacher_locations.length > 0 && (
          <div className="mt-auto">
            <TeacherLocations locations={teacher.teacher_locations} />
          </div>
        )}
      </div>
    </Card>
  );
};
