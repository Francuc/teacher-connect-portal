import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const LogoutButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // First clear any existing session data
      localStorage.removeItem('sb-qhqtflpajutstecqajbl-auth-token');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error during logout:', error);
        // If session not found or any other error, just redirect to auth
        navigate('/auth');
        return;
      }

      navigate('/auth');
      
    } catch (error: any) {
      console.error('Logout error:', error);
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
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full justify-start"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {t("logout")}
    </Button>
  );
};