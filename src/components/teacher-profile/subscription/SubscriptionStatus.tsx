import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

interface SubscriptionStatusProps {
  status: string;
  endDate?: string;
  type?: string;
  promoCode?: string;
  onToggleStatus?: () => Promise<void>;
  isLoading?: boolean;
}

export const SubscriptionStatus = ({ 
  status, 
  endDate, 
  type, 
  promoCode,
  onToggleStatus,
  isLoading 
}: SubscriptionStatusProps) => {
  const { t } = useLanguage();
  const hasValidSubscription = endDate && new Date(endDate) > new Date();
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">
          {t("status")}: {" "}
          <span className={status === 'active' ? 'text-green-600' : 'text-red-600'}>
            {status === 'active' ? t("active") : t("inactive")}
          </span>
        </p>
        {endDate && (
          <p className="text-sm text-muted-foreground">
            {t("validUntil")}: {formatDate(endDate)}
          </p>
        )}
        {type && (
          <p className="text-sm text-muted-foreground">
            {t("subscriptionType")}: {
              type === 'month' ? t("monthly") : 
              type === 'year' ? t("yearly") : 
              type === 'promo' ? t("promoSubscription") : 
              type
            }
          </p>
        )}
        {promoCode && (
          <p className="text-sm text-muted-foreground">
            {t("activePromoCode")}: {promoCode}
          </p>
        )}
      </div>

      {hasValidSubscription && onToggleStatus && (
        <Button
          onClick={onToggleStatus}
          variant={status === 'active' ? "destructive" : "default"}
          className="w-full gap-2"
          disabled={isLoading}
        >
          <Power className="h-4 w-4" />
          {status === 'active' ? t("deactivateProfile") : t("activateProfile")}
        </Button>
      )}
    </div>
  );
};