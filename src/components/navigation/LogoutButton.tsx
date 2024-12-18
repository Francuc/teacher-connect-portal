import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const LogoutButton = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      // First, get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If there's no session, just redirect to auth page
        navigate("/auth");
        return;
      }

      // Proceed with logout
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      navigate("/auth");
      toast({
        title: t("success"),
        description: t("logoutSuccess"),
        variant: "default",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      // If we get a 403 or session not found error, force redirect to auth
      if (error.status === 403 || (error.message && error.message.includes('session_not_found'))) {
        navigate("/auth");
        return;
      }
      
      toast({
        title: t("error"),
        description: t("logoutError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant="outline" 
      className="gap-2 h-12 px-6 text-base"
      disabled={isLoading}
    >
      <LogOut className="h-5 w-5" />
      {t("logout")}
    </Button>
  );
};