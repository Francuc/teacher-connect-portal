import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText } from "lucide-react";

type BiographySectionProps = {
  bio: string;
};

export const BiographySection = ({ bio }: BiographySectionProps) => {
  const { t } = useLanguage();

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-lg text-purple-dark">
          <FileText className="w-5 h-5 text-primary" />
          {t("biography")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
          {bio}
        </p>
      </CardContent>
    </Card>
  );
};