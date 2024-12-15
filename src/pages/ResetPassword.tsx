import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: t("error"),
          description: error.message,
        });
      } else {
        toast({
          title: t("success"),
          description: t("resetPasswordEmailSent"),
        });
        setEmail("");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorResettingPassword"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple.dark">
          {t("resetPassword")}
        </h2>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? t("loading") : t("resetPassword")}
          </Button>
        </form>
      </div>
    </div>
  );
}