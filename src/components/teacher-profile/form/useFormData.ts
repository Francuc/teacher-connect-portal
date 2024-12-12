import { useState, useEffect } from "react";
import { FormData } from "./types/teacherTypes";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import { useTeacherData } from "./hooks/useTeacherData";
import { TeachingLocation } from "@/lib/constants";

export const useFormData = (userId?: string) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    facebookProfile: "",
    showEmail: false,
    showPhone: false,
    showFacebook: false,
    bio: "",
    profilePicture: null,
    subjects: [],
    schoolLevels: [],
    teachingLocations: [],
    cityId: "",
    studentRegions: [],
    studentCities: [],
    pricePerHour: {
      teacherPlace: "",
      studentPlace: "",
      online: "",
    },
  });

  const { data: teacherData } = useTeacherData(userId);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || userId);
    };

    checkAuth();
  }, [userId]);

  useEffect(() => {
    if (teacherData?.profile) {
      const { profile, locations, subjects, schoolLevels, studentRegions, studentCities } = teacherData;

      setFormData(prev => ({
        ...prev,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        phone: profile.phone || "",
        facebookProfile: profile.facebook_profile || "",
        showEmail: profile.show_email,
        showPhone: profile.show_phone,
        showFacebook: profile.show_facebook,
        bio: profile.bio,
        cityId: profile.city_id || "",
        subjects: subjects.map(s => s.subject.name_en),
        schoolLevels,
        teachingLocations: locations.map(l => l.location_type) as TeachingLocation[],
        studentRegions,
        studentCities,
        pricePerHour: {
          teacherPlace: locations.find(l => l.location_type === "Teacher's Place")?.price_per_hour.toString() || "",
          studentPlace: locations.find(l => l.location_type === "Student's Place")?.price_per_hour.toString() || "",
          online: locations.find(l => l.location_type === "Online")?.price_per_hour.toString() || "",
        },
      }));
    }
  }, [teacherData]);

  return { formData, setFormData, isLoading, setIsLoading, currentUserId };
};