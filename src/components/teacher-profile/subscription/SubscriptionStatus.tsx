import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubscriptionStatusProps {
  status: string;
  endDate?: string | null;
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
    <Card className="border border-gray-200">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={status === 'active' ? 'default' : 'secondary'}>
              {status === 'active' ? t("active") : t("inactive")}
            </Badge>
            {type && (
              <Badge variant="outline">
                {type === 'month' ? t("monthly") : 
                 type === 'year' ? t("yearly") : 
                 type === 'promo' ? t("promoSubscription") : 
                 type}
              </Badge>
            )}
          </div>
          {hasValidSubscription && onToggleStatus && (
            <Switch
              checked={status === 'active'}
              onCheckedChange={onToggleStatus}
              disabled={isLoading}
            />
          )}
        </div>

        {endDate && (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{t("validUntil")}</p>
            <p>{formatDate(endDate)}</p>
          </div>
        )}

        {promoCode && (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{t("activePromoCode")}</p>
            <p className="font-mono bg-purple-50 px-2 py-1 rounded inline-block">
              {promoCode}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};