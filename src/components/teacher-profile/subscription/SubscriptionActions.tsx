import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Power } from "lucide-react";

interface SubscriptionActionsProps {
  hasValidSubscription: boolean;
  status: string;
  isLoading: boolean;
  onToggleStatus: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export const SubscriptionActions = ({ 
  hasValidSubscription, 
  status, 
  isLoading, 
  onToggleStatus,
  onDelete
}: SubscriptionActionsProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {hasValidSubscription && (
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

      <div className="pt-4 border-t">
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={isLoading}
          className="w-full"
        >
          {t("deleteProfile")}
        </Button>
      </div>
    </div>
  );
};