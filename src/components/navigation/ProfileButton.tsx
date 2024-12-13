import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export const ProfileButton = () => {
  const { session } = useAuth();
  const { t } = useLanguage();

  if (session) {
    return (
      <Link to="/profile">
        <Button variant="outline" className="h-12 px-6 text-base">
          {t("myProfile")}
        </Button>
      </Link>
    );
  }

  return (
    <Link to="/auth">
      <Button variant="outline" className="h-12 px-6 text-base">
        <UserPlus className="w-5 h-5 mr-2" />
        {t("createAd")}
      </Button>
    </Link>
  );
};