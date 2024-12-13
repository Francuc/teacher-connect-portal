import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Gift } from "lucide-react";

interface SubscriptionPlansProps {
  isLoading: boolean;
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
  onPromoCodeSubmit: () => Promise<void>;
  onSubscribe: (priceId: string) => Promise<void>;
}

export const SubscriptionPlans = ({
  isLoading,
  promoCode,
  onPromoCodeChange,
  onPromoCodeSubmit,
  onSubscribe
}: SubscriptionPlansProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <Button 
          onClick={() => onSubscribe('price_1QVVz2Hv0pYF1Q358iUsjhnh')}
          className="w-full"
        >
          {t("subscribeMonthly")} - 19€
        </Button>
        <Button 
          onClick={() => onSubscribe('price_1QVVzoHv0pYF1Q35XiTklnsb')}
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
          onChange={(e) => onPromoCodeChange(e.target.value)}
        />
        <Button 
          onClick={onPromoCodeSubmit}
          disabled={isLoading || !promoCode}
        >
          {t("apply")}
        </Button>
      </div>
    </div>
  );
};