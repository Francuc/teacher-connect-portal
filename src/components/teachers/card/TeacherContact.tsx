import { Mail, Phone, Facebook } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeacherContactProps {
  email?: string;
  phone?: string;
  showEmail?: boolean;
  showPhone?: boolean;
  showFacebook?: boolean;
  facebookProfile?: string;
}

export const TeacherContact = ({
  email,
  phone,
  showEmail,
  showPhone,
  showFacebook,
  facebookProfile,
}: TeacherContactProps) => {
  const { t } = useLanguage();

  return (
    <div className="mt-2 space-y-1">
      {showEmail && email && (
        <a 
          href={`mailto:${email}`}
          className="text-sm flex items-center gap-2 text-primary hover:text-primary/90"
        >
          <Mail className="w-4 h-4" />
          {email}
        </a>
      )}
      {showPhone && phone && (
        <a 
          href={`tel:${phone}`}
          className="text-sm flex items-center gap-2 text-primary hover:text-primary/90"
        >
          <Phone className="w-4 h-4" />
          {phone}
        </a>
      )}
      {showFacebook && facebookProfile && (
        <a 
          href={facebookProfile}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm flex items-center gap-2 text-primary hover:text-primary/90"
        >
          <Facebook className="w-4 h-4" />
          {t("facebookProfile")}
        </a>
      )}
    </div>
  );
};