import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const state = location.state as any;
      
      if (!state?.accessToken) {
        throw new Error("No access token found");
      }

      // Set the session with both access and refresh tokens
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: state.accessToken,
        refresh_token: state.refreshToken || ''
      });

      if (sessionError) throw sessionError;

      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: t("success"),
        description: t("passwordUpdated"),
      });

      // After successful password update, redirect to auth page
      navigate("/auth", { replace: true });
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        title: t("error"),
        description: error.message || t("errorResettingPassword"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-12">
      <h1 className="text-2xl font-bold mb-6">
        {t("updatePassword")}
      </h1>
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div>
          <Input
            type="password"
            placeholder={t("newPassword")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full"
        >
          {loading ? t("loading") : t("updatePassword")}
        </Button>
      </form>
    </div>
  );
}