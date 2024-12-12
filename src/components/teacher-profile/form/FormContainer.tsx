import { FormSections } from "./FormSections";
import { useFormData } from "./useFormData";
import { useFormSubmit } from "./useFormSubmit";
import { FormData } from "./types";

type FormContainerProps = {
  userId?: string;
};

export const FormContainer = ({ userId }: FormContainerProps) => {
  // Convert userId to string or undefined if it's an object
  const actualUserId = typeof userId === 'object' ? undefined : userId;
  
  const { formData, setFormData, isLoading, setIsLoading, currentUserId } = useFormData(actualUserId);
  const { handleSubmit } = useFormSubmit(
    formData as FormData, 
    isLoading, 
    setIsLoading, 
    actualUserId || currentUserId,
    !actualUserId // isNewProfile when there's no userId in the URL
  );

  console.log('FormContainer rendered with:', {
    userId: actualUserId,
    currentUserId,
    formData,
    isLoading,
    isNewProfile: !actualUserId
  });

  // For new profile creation, we only need currentUserId
  if (!actualUserId && !currentUserId) {
    console.log('No currentUserId available for new profile creation');
    return null;
  }

  return (
    <FormSections 
      formData={formData as FormData}
      setFormData={setFormData}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      isUpdate={!!actualUserId}
    />
  );
};