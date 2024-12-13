import { Mail, Phone, Facebook } from "lucide-react";

interface TeacherContactInfoProps {
  email?: string;
  phone?: string;
  showEmail?: boolean;
  showPhone?: boolean;
  showFacebook?: boolean;
  facebookProfile?: string;
}

export const TeacherContactInfo = ({
  email,
  phone,
  showEmail,
  showPhone,
  showFacebook,
  facebookProfile,
}: TeacherContactInfoProps) => {
  return (
    <div className="space-y-0.5 mt-1">
      {showEmail && email && (
        <a 
          href={`mailto:${email}`}
          className="text-xs flex items-center gap-1 text-primary hover:text-primary/90"
        >
          <Mail className="w-3 h-3" />
          {email}
        </a>
      )}
      {showPhone && phone && (
        <a 
          href={`tel:${phone}`}
          className="text-xs flex items-center gap-1 text-primary hover:text-primary/90"
        >
          <Phone className="w-3 h-3" />
          {phone}
        </a>
      )}
      {showFacebook && facebookProfile && (
        <a 
          href={facebookProfile}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs flex items-center gap-1 text-primary hover:text-primary/90"
        >
          <Facebook className="w-3 h-3" />
          Facebook Profile
        </a>
      )}
    </div>
  );
};