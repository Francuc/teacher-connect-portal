import { FormSections } from "./FormSections";
import { useFormData } from "./useFormData";
import { useFormSubmit } from "./useFormSubmit";
import { FormData } from "./types";
import { useAuth } from "@/hooks/useAuth";

type FormContainerProps = {
  userId?: string;
  initialData?: any;
  onSuccess?: (updatedProfile: any) => void;
};

export const FormContainer = ({ userId, initialData, onSuccess }: FormContainerProps) => {
  const { formData, setFormData, isLoading, setIsLoading } = useFormData(userId, initialData);
  const { handleSubmit } = useFormSubmit(
    formData as FormData,
    isLoading,
    setIsLoading,
    userId || crypto.randomUUID(),
    !userId,
    onSuccess
  );
  const { session } = useAuth();

  console.log('FormContainer - subscription data:', {
    status: formData.subscription_status,
    type: formData.subscription_type,
    endDate: formData.subscription_end_date,
    promoCode: formData.promo_code
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
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