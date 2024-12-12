import { TeacherProfileView } from "./teacher-profile/TeacherProfileView";
import { FormContainer } from "./teacher-profile/form/FormContainer";

const TeacherProfileForm = () => {
  const path = window.location.pathname;
  const isViewMode = path.includes('/profile/') && !path.includes('/new') && !path.includes('/edit');
  const isEditMode = path.includes('/edit');
  
  if (isViewMode || isEditMode) {
    const userId = path.split('/profile/')[1].split('/')[0];
    if (isViewMode) {
      return <TeacherProfileView userId={userId} />;
    }
    return <FormContainer userId={userId} />;
  }

  return <FormContainer />;
};

export default TeacherProfileForm;