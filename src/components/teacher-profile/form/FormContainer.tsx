import { FormSections } from "./FormSections";
import { useFormData } from "./useFormData";
import { useFormSubmit } from "./useFormSubmit";

type FormContainerProps = {
  userId?: string;
};

export const FormContainer = ({ userId }: FormContainerProps) => {
  const { formData, setFormData, isLoading, setIsLoading, currentUserId } = useFormData(userId);
  const { handleSubmit } = useFormSubmit(formData, isLoading, setIsLoading, userId || currentUserId);

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
      formData={formData}
      setFormData={setFormData}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      isUpdate={!!userId}
    />
  );
};