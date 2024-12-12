import { useParams } from "react-router-dom";
import { TeacherProfileView } from "./teacher-profile/TeacherProfileView";
import { FormContainer } from "./teacher-profile/form/FormContainer";
import { createRandomTeachers } from "@/lib/createRandomTeachers";
import { useEffect } from "react";

const TeacherProfileForm = () => {
  const { userId } = useParams();
  const path = window.location.pathname;
  const isViewMode = path.includes('/profile/') && !path.includes('/new') && !path.includes('/edit');
  const isEditMode = path.includes('/edit');
  
  useEffect(() => {
    // Create random teachers when component mounts
    createRandomTeachers()
      .then(() => console.log('Random teachers created successfully'))
      .catch(error => console.error('Error creating random teachers:', error));
  }, []); // Empty dependency array means this runs once when component mounts
  
  if (isViewMode) {
    return <TeacherProfileView userId={userId || ''} />;
  }

  return <FormContainer userId={userId} />;
};

export default TeacherProfileForm;