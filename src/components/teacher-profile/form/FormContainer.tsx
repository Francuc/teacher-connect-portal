import { FormSections } from "./FormSections";
import { useFormData } from "./useFormData";
import { useFormSubmit } from "./useFormSubmit";

type FormContainerProps = {
  userId?: string;
};

export const FormContainer = ({ userId }: FormContainerProps) => {
  // Convert userId to string or undefined if it's an object
  const actualUserId = typeof userId === 'object' ? undefined : userId;
  
  const { formData, setFormData, isLoading, setIsLoading, currentUserId } = useFormData(actualUserId);
  const { handleSubmit } = useFormSubmit(
    formData,
    isLoading,
    setIsLoading,
    actualUserId || currentUserId,
    !actualUserId // isNewProfile when there's no userId in the URL
  );

  // For new profile creation, we need currentUserId
  if (!actualUserId && !currentUserId) {
    console.log('No currentUserId available for new profile creation');
    return null;
  }

  return (
    <FormSections 
      formData={formData}
      setFormData={setFormData}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      isUpdate={!!actualUserId}
    />
  );
};