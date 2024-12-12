import { TeacherProfileView } from "./teacher-profile/TeacherProfileView";
import { FormContainer } from "./teacher-profile/form/FormContainer";

type TeacherProfileFormProps = {
  userId?: string;
};

const TeacherProfileForm = ({ userId }: TeacherProfileFormProps) => {
  const path = window.location.pathname;
  const isViewMode = path.includes('/profile/') && !path.includes('/new') && !path.includes('/edit');
  const isEditMode = path.includes('/edit');
  
  if (isViewMode || isEditMode) {
    const pathUserId = path.split('/profile/')[1].split('/')[0];
    if (isViewMode) {
      return <TeacherProfileView userId={pathUserId} />;
    }
    return <FormContainer userId={pathUserId} />;
  }

  return <FormContainer />;
};

export default TeacherProfileForm;