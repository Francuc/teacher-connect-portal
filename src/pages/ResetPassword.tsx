import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"request" | "update">("request");

  useEffect(() => {
    const state = location.state as any;
    if (state?.mode === "update") {
      setMode("update");
    }
  }, [location]);

  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(time => Math.max(0, time - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cooldownTime > 0) {
      toast({
        title: t("error"),
        description: t("pleaseWait").replace("{seconds}", cooldownTime.toString()),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (mode === "update") {
        const state = location.state as any;
        
        if (state?.accessToken) {
          // Set the session with both access and refresh tokens if available
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
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
        } else {
          throw new Error("No access token found");
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });

        if (error) {
          if (error.message.includes("rate_limit")) {
            const seconds = parseInt(error.message.match(/\d+/)?.[0] || "33");
            setCooldownTime(seconds);
            throw new Error(t("pleaseWait").replace("{seconds}", seconds.toString()));
          }
          throw error;
        }

        toast({
          title: t("success"),
          description: t("resetPasswordEmailSent"),
        });
      }
    } catch (error: any) {
      console.error("Error with password reset:", error);
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
        {mode === "update" ? t("updatePassword") : t("resetPassword")}
      </h1>
      <form onSubmit={handleResetPassword} className="space-y-4">
        {mode === "request" ? (
          <div>
            <Input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        ) : (
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
        )}
        <Button 
          type="submit" 
          disabled={loading || cooldownTime > 0} 
          className="w-full"
        >
          {loading 
            ? t("loading") 
            : cooldownTime > 0 
              ? `${t("wait")} ${cooldownTime}s` 
              : mode === "update" 
                ? t("updatePassword") 
                : t("resetPassword")}
        </Button>
      </form>
    </div>
  );
}