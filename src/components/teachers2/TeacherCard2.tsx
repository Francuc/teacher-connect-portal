import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeacherLocations } from "./card/TeacherLocations";
import { TeacherAvailableCities } from "./card/TeacherAvailableCities";
import { TeacherContactInfo } from "./card/TeacherContactInfo";
import { Section } from "./card/Section";

interface TeacherCardProps {
  teacher: any;
  isDisabled?: boolean;
}

export const TeacherCard2 = ({ teacher, isDisabled = false }: TeacherCardProps) => {
  const { language } = useLanguage();
  const prefix = language === 'fr' ? 'cours-de-rattrapage' : language === 'lb' ? 'nohellef' : 'tutoring';
  const teacherName = `${teacher.first_name}-${teacher.last_name}`.toLowerCase().replace(/\s+/g, '-');
  const url = `/${prefix}/general/${teacherName}`;

  return (
    <Link to={url} className={`block ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={teacher.profile_picture_url} />
              <AvatarFallback>{`${teacher.first_name[0]}${teacher.last_name[0]}`}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{`${teacher.first_name} ${teacher.last_name}`}</h3>
            </div>
          </div>

          <TeacherLocations locations={teacher.teacher_locations || []} />
          <TeacherAvailableCities cities={teacher.teacher_student_cities || []} />
          <TeacherContactInfo 
            email={teacher.email}
            phone={teacher.phone}
            showEmail={teacher.show_email}
            showPhone={teacher.show_phone}
            showFacebook={teacher.show_facebook}
            facebookProfile={teacher.facebook_profile}
          />
        </div>
      </Card>
    </Link>
  );
};