import { FormSections } from "./FormSections";
import { useFormData } from "./useFormData";
import { useFormSubmit } from "./useFormSubmit";
import { FormData } from "./types";

type FormContainerProps = {
  userId?: string;
};

export const FormContainer = ({ userId }: FormContainerProps) => {
  const { formData, setFormData, isLoading, setIsLoading, currentUserId } = useFormData(userId);
  const { handleSubmit } = useFormSubmit(
    formData as FormData, 
    isLoading, 
    setIsLoading, 
    userId || currentUserId,
    !userId // isNewProfile when there's no userId in the URL
  );

  console.log('FormContainer rendered with:', {
    userId,
    currentUserId,
    formData,
    isLoading
  });

  if (!userId && !currentUserId) {
    console.log('No userId or currentUserId available');
    return null;
  }

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