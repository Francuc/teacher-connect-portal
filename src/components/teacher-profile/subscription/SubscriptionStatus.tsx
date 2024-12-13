import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubscriptionStatusProps {
  status: string;
  endDate?: string;
  type?: string;
  promoCode?: string;
}

export const SubscriptionStatus = ({ status, endDate, type, promoCode }: SubscriptionStatusProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        {t("status")}: {" "}
        <span className={status === 'active' ? 'text-green-600' : 'text-red-600'}>
          {status === 'active' ? t("active") : t("inactive")}
        </span>
      </p>
      {status === 'active' && (
        <>
          <p className="text-sm text-muted-foreground">
            {t("validUntil")}: {formatDate(endDate || '')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("subscriptionType")}: {type === 'month' ? t("monthly") : 
              type === 'year' ? t("yearly") : 
              type === 'promo' ? t("promoSubscription") : 
              type}
          </p>
        </>
      )}
      {promoCode && (
        <p className="text-sm text-muted-foreground">
          {t("activePromoCode")}: {promoCode}
        </p>
      )}
    </div>
  );
};