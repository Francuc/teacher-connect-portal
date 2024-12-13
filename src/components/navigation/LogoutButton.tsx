import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const LogoutButton = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast({
        title: t("success"),
        description: t("logoutSuccess"),
        variant: "default",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: t("error"),
        description: t("logoutError"),
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant="outline" 
      className="gap-2 h-12 px-6 text-base"
    >
      <LogOut className="h-5 w-5" />
      {t("logout")}
    </Button>
  );
};