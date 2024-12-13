import { FormSections } from "./FormSections";
import { useFormData } from "./useFormData";
import { useFormSubmit } from "./useFormSubmit";
import { FormData } from "./types";

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

  return (
    <FormSections 
      formData={formData as FormData}
      setFormData={setFormData}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      isUpdate={!!userId}
    />
  );
};