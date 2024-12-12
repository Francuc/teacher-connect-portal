import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Facebook } from "lucide-react";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("personalInformation")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex justify-center">
            <Avatar className="w-32 h-32">
              {profile.profile_picture_url ? (
                <AvatarImage src={profile.profile_picture_url} />
              ) : (
                <AvatarFallback>
                  <User className="w-16 h-16" />
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{t("name")}</h3>
              <p className="text-lg">{`${profile.first_name} ${profile.last_name}`}</p>
            </div>
            <div>
              <h3 className="font-semibold">{t("contactInformation")}</h3>
              <div className="space-y-2">
                {profile.show_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a 
                      href={`mailto:${profile.email}`}
                      className="text-primary hover:text-primary/90"
                    >
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.show_phone && profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a 
                      href={`tel:${profile.phone}`}
                      className="text-primary hover:text-primary/90"
                    >
                      {profile.phone}
                    </a>
                  </div>
                )}
                {profile.show_facebook && profile.facebook_profile && (
                  <div className="flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    <a 
                      href={profile.facebook_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/90"
                    >
                      {t("facebookProfile")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};