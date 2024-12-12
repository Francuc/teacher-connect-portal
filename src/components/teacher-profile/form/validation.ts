import { FormData } from "./types";

export const validateForm = (formData: FormData, t: (key: string) => string) => {
  const errors: string[] = [];

  if (!formData.firstName) errors.push(t("firstName"));
  if (!formData.lastName) errors.push(t("lastName"));
  if (!formData.email) errors.push(t("email"));
  if (!formData.bio) errors.push(t("bio"));
  if (formData.subjects.length === 0) errors.push(t("subjects"));
  if (formData.schoolLevels.length === 0) errors.push(t("schoolLevels"));
  if (formData.teachingLocations.length === 0) errors.push(t("teachingLocations"));
  
  if (formData.teachingLocations.includes("Teacher's Place")) {
    if (!formData.cityId) {
      errors.push(t("teacherCity"));
    }
    if (!formData.pricePerHour.teacherPlace || parseFloat(formData.pricePerHour.teacherPlace) <= 0) {
      errors.push(t("priceRequired"));
    }
  }

  if (formData.teachingLocations.includes("Student's Place")) {
    if (!formData.pricePerHour.studentPlace || parseFloat(formData.pricePerHour.studentPlace) <= 0) {
      errors.push(t("priceRequired"));
    }
  }

  if (formData.teachingLocations.includes("Online")) {
    if (!formData.pricePerHour.online || parseFloat(formData.pricePerHour.online) <= 0) {
      errors.push(t("priceRequired"));
    }
  }

  return errors;
};