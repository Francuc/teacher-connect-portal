import { TeacherProfileView } from "./teacher-profile/TeacherProfileView";
import { FormContainer } from "./teacher-profile/form/FormContainer";

const TeacherProfileForm = () => {
  // If we're viewing the profile, show the TeacherProfileView component
  if (window.location.pathname.includes('/profile/') && !window.location.pathname.includes('/new')) {
    const userId = window.location.pathname.split('/profile/')[1];
    return <TeacherProfileView userId={userId} />;
  }

  // Otherwise show the form
  return <FormContainer />;
};

export default TeacherProfileForm;
