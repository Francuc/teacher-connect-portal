import { Plus, User } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

interface ProfileButtonProps {
  session: Session | null;
}

export const ProfileButton = ({ session }: ProfileButtonProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleProfileAction = async () => {
    if (!session) {
      navigate("/auth");
      return;
    }

    // If user is logged in, redirect directly to their profile page
    navigate(`/profile/${session.user.id}`);
  };

  return (
    <Button 
      onClick={handleProfileAction} 
      className="gap-2 bg-primary hover:bg-primary/90 text-white h-12 px-6 text-base"
    >
      <Plus className="h-5 w-5" />
      {session ? t("myProfile") : t("createAd")}
    </Button>
  );
};