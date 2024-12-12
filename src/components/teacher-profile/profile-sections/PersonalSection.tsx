import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

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
        <div className="grid gap-4">
          <div>
            <h3 className="font-semibold">{t("name")}</h3>
            <p>{`${profile.first_name} ${profile.last_name}`}</p>
          </div>
          {profile.show_email && (
            <div>
              <h3 className="font-semibold">{t("email")}</h3>
              <p>{profile.email}</p>
            </div>
          )}
          {profile.show_phone && profile.phone && (
            <div>
              <h3 className="font-semibold">{t("phone")}</h3>
              <p>{profile.phone}</p>
            </div>
          )}
          {profile.show_facebook && profile.facebook_profile && (
            <div>
              <h3 className="font-semibold">{t("facebookProfile")}</h3>
              <p>{profile.facebook_profile}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};