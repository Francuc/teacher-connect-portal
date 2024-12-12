import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText } from "lucide-react";

type BiographySectionProps = {
  bio: string;
};

export const BiographySection = ({ bio }: BiographySectionProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {t("biography")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap leading-relaxed">{bio}</p>
      </CardContent>
    </Card>
  );
};