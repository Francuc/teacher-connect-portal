import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, MapPin, Mail, Phone, Facebook } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeacherHeaderProps {
  teacher: any;
  getTeacherLocation: (teacher: any) => string;
}

export const TeacherHeader = ({ teacher, getTeacherLocation }: TeacherHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-start gap-4 mb-4">
      <Avatar className="w-24 h-24 rounded-xl border-2 border-primary/20">
        {teacher.profile_picture_url ? (
          <AvatarImage 
            src={teacher.profile_picture_url} 
            alt={`${teacher.first_name} ${teacher.last_name}`}
            className="object-cover"
          />
        ) : (
          <AvatarFallback className="bg-primary/5">
            <User className="w-12 h-12 text-primary/50" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-purple-dark truncate">
          {teacher.first_name} {teacher.last_name}
        </h3>
        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{getTeacherLocation(teacher)}</span>
        </p>
        
        <div className="mt-2 space-y-1">
          {teacher.show_email && teacher.email && (
            <a 
              href={`mailto:${teacher.email}`}
              className="text-sm text-primary hover:text-primary/90 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {teacher.email}
            </a>
          )}
          {teacher.show_phone && teacher.phone && (
            <a 
              href={`tel:${teacher.phone}`}
              className="text-sm text-primary hover:text-primary/90 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              {teacher.phone}
            </a>
          )}
          {teacher.show_facebook && teacher.facebook_profile && (
            <a 
              href={teacher.facebook_profile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/90 flex items-center gap-2"
            >
              <Facebook className="w-4 h-4" />
              {t("facebookProfile")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};