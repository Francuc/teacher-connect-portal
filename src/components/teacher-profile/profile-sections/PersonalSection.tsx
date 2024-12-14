import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Facebook } from "lucide-react";
import { supabase } from "@/lib/supabase";

type PersonalSectionProps = {
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    facebook_profile: string | null;
    show_email: boolean;
    show_phone: boolean;
    show_facebook: boolean;
    profile_picture_url: string | null;
  };
};

export const PersonalSection = ({ profile }: PersonalSectionProps) => {
  const { t } = useLanguage();

  const getProfilePictureUrl = () => {
    if (profile.profile_picture_url) {
      if (profile.profile_picture_url.startsWith('http')) {
        return profile.profile_picture_url;
      }
      const { data: { publicUrl } } = supabase
        .storage
        .from('profile-pictures')
        .getPublicUrl(profile.profile_picture_url);
      return publicUrl;
    }
    return '';
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-center">
        <Avatar className="w-32 h-32 rounded-xl border-4 border-primary/20">
          {profile.profile_picture_url ? (
            <AvatarImage 
              src={getProfilePictureUrl()}
              alt={`${profile.first_name} ${profile.last_name}`}
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="bg-primary/5">
              <User className="w-16 h-16 text-primary/50" />
            </AvatarFallback>
          )}
        </Avatar>
      </div>
      
      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-purple-dark">
            {`${profile.first_name} ${profile.last_name}`}
          </h2>
        </div>

        <div className="space-y-2">
          {profile.show_email && profile.email && (
            <a 
              href={`mailto:${profile.email}`}
              className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>{profile.email}</span>
            </a>
          )}
          
          {profile.show_phone && profile.phone && (
            <a 
              href={`tel:${profile.phone}`}
              className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{profile.phone}</span>
            </a>
          )}
          
          {profile.show_facebook && profile.facebook_profile && (
            <a 
              href={profile.facebook_profile}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
            >
              <Facebook className="w-4 h-4" />
              <span>{t("facebookProfile")}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};