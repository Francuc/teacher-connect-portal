import { useParams } from "react-router-dom";
import { TeacherProfileView } from "./teacher-profile/TeacherProfileView";
import { FormContainer } from "./teacher-profile/form/FormContainer";

const TeacherProfileForm = () => {
  const { userId } = useParams();
  const path = window.location.pathname;
  const isViewMode = path.includes('/profile/') && !path.includes('/new') && !path.includes('/edit');
  
  if (isViewMode) {
    return <TeacherProfileView userId={userId || ''} />;
  }

  return <FormContainer userId={userId} />;
};

export default TeacherProfileForm;