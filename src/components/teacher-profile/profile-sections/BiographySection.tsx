import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

type BiographySectionProps = {
  bio: string;
};

export const BiographySection = ({ bio }: BiographySectionProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("biography")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{bio}</p>
      </CardContent>
    </Card>
  );
};