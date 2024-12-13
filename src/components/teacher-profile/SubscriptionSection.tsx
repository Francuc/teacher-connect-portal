import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { CreditCard } from "lucide-react";
import { SubscriptionStatus } from "./subscription/SubscriptionStatus";
import { SubscriptionPlans } from "./subscription/SubscriptionPlans";
import { SubscriptionActions } from "./subscription/SubscriptionActions";

interface SubscriptionSectionProps {
  profile: any;
  isOwnProfile: boolean;
}

export const SubscriptionSection = ({ profile: initialProfile, isOwnProfile }: SubscriptionSectionProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(initialProfile);

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

  const handleToggleProfileStatus = async () => {
    try {
      setIsLoading(true);
      const newStatus = profile.subscription_status === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('teachers')
        .update({ subscription_status: newStatus })
        .eq('user_id', profile.user_id);

      if (error) throw error;

      setProfile(prev => ({
        ...prev,
        subscription_status: newStatus
      }));

      toast({
        title: t("success"),
        description: t(newStatus === 'active' ? "profileActivated" : "profileDeactivated"),
      });
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
        <SubscriptionStatus 
          status={profile.subscription_status}
          endDate={profile.subscription_end_date}
          type={profile.subscription_type}
          promoCode={profile.promo_code}
          onToggleStatus={handleToggleProfileStatus}
          isLoading={isLoading}
        />

        {profile.subscription_status !== 'active' && !hasValidSubscription && (
          <SubscriptionPlans 
            isLoading={isLoading}
            promoCode={promoCode}
            onPromoCodeChange={setPromoCode}
            onPromoCodeSubmit={handlePromoCode}
            onSubscribe={handleSubscribe}
          />
        )}

        <SubscriptionActions 
          hasValidSubscription={hasValidSubscription}
          status={profile.subscription_status}
          isLoading={isLoading}
          onToggleStatus={handleToggleProfileStatus}
          onDelete={handleDeleteProfile}
        />
      </CardContent>
    </Card>
  );
};