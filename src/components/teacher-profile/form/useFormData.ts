import { useState, useEffect } from "react";
import { FormData } from "./types";
import { useDefaultCity } from "./hooks/useDefaultCity";

export const useFormData = (userId?: string, initialData?: any) => {
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

  useEffect(() => {
    if (initialData) {
      console.log('Setting initial form data:', initialData);
      
      const pricePerHour = {
        teacherPlace: "",
        studentPlace: "",
        online: ""
      };

      initialData.teacher_locations?.forEach((location: any) => {
        switch (location.location_type) {
          case "Teacher's Place":
            pricePerHour.teacherPlace = location.price_per_hour.toString();
            break;
          case "Student's Place":
            pricePerHour.studentPlace = location.price_per_hour.toString();
            break;
          case "Online":
            pricePerHour.online = location.price_per_hour.toString();
            break;
        }
      });

      setFormData({
        firstName: initialData.first_name || '',
        lastName: initialData.last_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        facebookProfile: initialData.facebook_profile || '',
        showEmail: initialData.show_email || false,
        showPhone: initialData.show_phone || false,
        showFacebook: initialData.show_facebook || false,
        bio: initialData.bio || '',
        profilePicture: null,
        profilePictureUrl: initialData.profile_picture_url || '',
        subjects: initialData.teacher_subjects?.map((s: any) => ({
          subject_id: s.subject.id,
          subject: s.subject
        })) || [],
        schoolLevels: initialData.teacher_school_levels?.map((l: any) => l.school_level) || [],
        teachingLocations: initialData.teacher_locations?.map((l: any) => l.location_type) || [],
        cityId: initialData.city_id || null,
        studentRegions: initialData.teacher_student_regions?.map((r: any) => r.region_name) || [],
        studentCities: initialData.teacher_student_cities?.map((c: any) => c.city_id) || [],
        pricePerHour,
        subscription_status: initialData.subscription_status,
        subscription_type: initialData.subscription_type,
        subscription_end_date: initialData.subscription_end_date,
        promo_code: initialData.promo_code
      });
    }
  }, [initialData]);

  useDefaultCity(formData, setFormData, userId);

  return { formData, setFormData, isLoading, setIsLoading };
};