import { useState } from "react";
import { FormData } from "./types";
import { useDefaultCity } from "./hooks/useDefaultCity";
import { useTeacherData } from "./hooks/useTeacherData";

export const useFormData = (userId?: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    facebookProfile: "",
    showEmail: true,
    showPhone: true,
    showFacebook: true,
    bio: "",
    profilePicture: null,
    profilePictureUrl: "",
    subjects: [],
    schoolLevels: [],
    teachingLocations: [],
    cityId: null,
    studentRegions: [],
    studentCities: [],
    pricePerHour: {
      teacherPlace: "",
      studentPlace: "",
      online: "",
    },
    subscription_status: undefined,
    subscription_type: undefined,
    subscription_end_date: undefined,
    promo_code: undefined
  });

  useDefaultCity(formData, setFormData, userId);
  useTeacherData(userId, setFormData);

  return { formData, setFormData, isLoading, setIsLoading };
};