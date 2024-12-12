import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

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
            {profile.show_email && (
              <div>
                <h3 className="font-semibold">{t("email")}</h3>
                <p className="text-primary hover:text-primary/90">
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </p>
              </div>
            )}
            {profile.show_phone && profile.phone && (
              <div>
                <h3 className="font-semibold">{t("phone")}</h3>
                <p className="text-primary hover:text-primary/90">
                  <a href={`tel:${profile.phone}`}>{profile.phone}</a>
                </p>
              </div>
            )}
            {profile.show_facebook && profile.facebook_profile && (
              <div>
                <h3 className="font-semibold">{t("facebookProfile")}</h3>
                <p className="text-primary hover:text-primary/90">
                  <a href={profile.facebook_profile} target="_blank" rel="noopener noreferrer">
                    {profile.facebook_profile}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};