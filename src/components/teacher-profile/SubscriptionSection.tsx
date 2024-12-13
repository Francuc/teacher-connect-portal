import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { CreditCard, Gift, Power } from "lucide-react";

interface SubscriptionSectionProps {
  profile: any;
  isOwnProfile: boolean;
}

export const SubscriptionSection = ({ profile, isOwnProfile }: SubscriptionSectionProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (priceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: t("error"),
        description: t("error"),
        variant: "destructive",
      });
    }
  };

  const handlePromoCode = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('check-promo', {
        body: { promoCode, userId: profile.user_id }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: t("success"),
          description: t("promoCodeApplied"),
        });
        window.location.reload();
      } else {
        toast({
          title: t("error"),
          description: t("invalidPromoCode"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking promo code:', error);
      toast({
        title: t("error"),
        description: t("error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm(t("confirmDeleteProfile"))) return;

    try {
      setIsLoading(true);
      const { error } = await supabase.functions.invoke('delete-profile', {
        body: { userId: profile.user_id }
      });

      if (error) throw error;

      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: t("error"),
        description: t("error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleProfileStatus = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('teachers')
        .update({ 
          subscription_status: profile.subscription_status === 'active' ? 'inactive' : 'active' 
        })
        .eq('user_id', profile.user_id);

      if (error) throw error;

      toast({
        title: t("success"),
        description: profile.subscription_status === 'active' 
          ? t("profileDeactivated") 
          : t("profileActivated"),
      });
      
      window.location.reload();
    } catch (error) {
      console.error('Error toggling profile status:', error);
      toast({
        title: t("error"),
        description: t("error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const hasValidSubscription = profile.subscription_end_date && new Date(profile.subscription_end_date) > new Date();

  if (!isOwnProfile) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          {t("subscription")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {t("status")}: {" "}
            <span className={profile.subscription_status === 'active' ? 'text-green-600' : 'text-red-600'}>
              {profile.subscription_status === 'active' ? t("active") : t("inactive")}
            </span>
          </p>
          {profile.subscription_status === 'active' && (
            <>
              <p className="text-sm text-muted-foreground">
                {t("validUntil")}: {formatDate(profile.subscription_end_date)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("subscriptionType")}: {profile.subscription_type === 'month' ? t("monthly") : 
                  profile.subscription_type === 'year' ? t("yearly") : 
                  profile.subscription_type === 'promo' ? t("promoSubscription") : 
                  profile.subscription_type}
              </p>
            </>
          )}
          {profile.promo_code && (
            <p className="text-sm text-muted-foreground">
              {t("activePromoCode")}: {profile.promo_code}
            </p>
          )}
        </div>

        {hasValidSubscription && (
          <Button
            onClick={handleToggleProfileStatus}
            variant={profile.subscription_status === 'active' ? "destructive" : "default"}
            className="w-full gap-2"
            disabled={isLoading}
          >
            <Power className="h-4 w-4" />
            {profile.subscription_status === 'active' ? t("deactivateProfile") : t("activateProfile")}
          </Button>
        )}

        {profile.subscription_status !== 'active' && !hasValidSubscription && (
          <>
            <div className="grid gap-4">
              <Button 
                onClick={() => handleSubscribe('price_1QVVz2Hv0pYF1Q358iUsjhnh')}
                className="w-full"
              >
                {t("subscribeMonthly")} - 19€
              </Button>
              <Button 
                onClick={() => handleSubscribe('price_1QVVzoHv0pYF1Q35XiTklnsb')}
                className="w-full"
              >
                {t("subscribeYearly")} - 199€
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <Input
                placeholder={t("enterPromoCode")}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button 
                onClick={handlePromoCode}
                disabled={isLoading || !promoCode}
              >
                {t("apply")}
              </Button>
            </div>
          </>
        )}

        <div className="pt-4 border-t">
          <Button
            variant="destructive"
            onClick={handleDeleteProfile}
            disabled={isLoading}
            className="w-full"
          >
            {t("deleteProfile")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};