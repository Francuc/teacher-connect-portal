import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/utils";

interface SubscriptionActionsProps {
  hasValidSubscription: boolean;
  status: string;
  isLoading: boolean;
  onDelete: () => Promise<void>;
  endDate?: string;
  type?: string;
  promoCode?: string;
}

export const SubscriptionActions = ({ 
  hasValidSubscription,
  status,
  isLoading,
  onDelete,
  endDate,
  type,
  promoCode
}: SubscriptionActionsProps) => {
  const { t } = useLanguage();

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

      <div className="pt-4 border-t">
        <Button
          variant="destructive"
          className="w-full"
          onClick={onDelete}
          disabled={isLoading}
        >
          {t("deleteProfile")}
        </Button>
      </div>
    </div>
  );
};