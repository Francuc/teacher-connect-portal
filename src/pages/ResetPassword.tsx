import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";

interface ResetPasswordProps {
  mode?: "request" | "update";
}

export default function ResetPassword({ mode = "request" }: ResetPasswordProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we have a recovery token in the URL
    const hash = location.hash;
    if (hash && hash.includes("access_token")) {
      // Extract the token
      const accessToken = new URLSearchParams(hash.substring(1)).get("access_token");
      if (accessToken) {
        // Redirect to update password page with the token
        navigate("/update-password", { state: { accessToken } });
      }
    }
  }, [location, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "update") {
        const { state } = location as { state: { accessToken?: string } };
        if (!state?.accessToken) {
          throw new Error("No access token found");
        }

        const { error } = await supabase.auth.updateUser({
          password: password
        });

        if (error) throw error;

        toast({
          title: t("success"),
          description: t("passwordUpdated"),
        });

        // Redirect to login page
        navigate("/auth");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });

        if (error) throw error;

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
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t("loading") : mode === "update" ? t("updatePassword") : t("resetPassword")}
        </Button>
      </form>
    </div>
  );
}