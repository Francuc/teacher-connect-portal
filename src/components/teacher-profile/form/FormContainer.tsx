import { FormSections } from "./FormSections";
import { useFormData } from "./useFormData";
import { useFormSubmit } from "./useFormSubmit";
import { FormData } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

type FormContainerProps = {
  userId?: string;
};

export const FormContainer = ({ userId }: FormContainerProps) => {
  const { formData, setFormData, isLoading, setIsLoading } = useFormData(userId);
  const { handleSubmit } = useFormSubmit(
    formData as FormData,
    isLoading,
    setIsLoading,
    userId || crypto.randomUUID(),
    !userId
  );
  const { session } = useAuth();
  const { t } = useLanguage();

  console.log('FormContainer - subscription data:', {
    status: formData.subscription_status,
    type: formData.subscription_type,
    endDate: formData.subscription_end_date,
    promoCode: formData.promo_code
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {userId && session?.user && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("subscriptionStatus")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{t("status")}:</span>
                <Badge variant={formData.subscription_status === 'active' ? 'default' : 'secondary'}>
                  {formData.subscription_status || 'inactive'}
                </Badge>
              </div>
              {formData.subscription_type && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("type")}:</span>
                  <Badge variant="outline">{formData.subscription_type}</Badge>
                </div>
              )}
              {formData.subscription_end_date && (
                <div>
                  <span className="font-medium">{t("validUntil")}:</span>
                  <p className="text-sm text-muted-foreground">
                    {new Date(formData.subscription_end_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {formData.promo_code && (
                <div>
                  <span className="font-medium">{t("promoCode")}:</span>
                  <p className="font-mono bg-purple-50 px-2 py-1 rounded inline-block ml-2">
                    {formData.promo_code}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <FormSections 
        formData={formData as FormData}
        setFormData={setFormData}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        isUpdate={!!userId}
      />
    </div>
  );
};