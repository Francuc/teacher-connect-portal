import { useState, useEffect } from "react";
import { FormData, TeacherSubject } from "./types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchTeacherData = async () => {
        try {
          const { data: teacherData, error } = await supabase
            .from('teachers')
            .select(`
              *,
              teacher_subjects (
                subject_id,
                subject:subjects (
                  id,
                  name_en,
                  name_fr,
                  name_lb
                )
              )
            `)
            .eq('user_id', userId)
            .single();

          if (error) throw error;

          setFormData(prev => ({
            ...prev,
            firstName: teacherData.first_name,
            lastName: teacherData.last_name,
            email: teacherData.email,
            phone: teacherData.phone || "",
            facebookProfile: teacherData.facebook_profile || "",
            showEmail: teacherData.show_email,
            showPhone: teacherData.show_phone,
            showFacebook: teacherData.show_facebook,
            bio: teacherData.bio,
            cityId: teacherData.city_id || "",
            subjects: teacherData.teacher_subjects as TeacherSubject[],
            schoolLevels: teacherData.school_levels || [],
            teachingLocations: teacherData.locations || [],
            studentRegions: teacherData.student_regions || [],
            studentCities: teacherData.student_cities || [],
            pricePerHour: {
              teacherPlace: teacherData.price_per_hour_teacher || "",
              studentPlace: teacherData.price_per_hour_student || "",
              online: teacherData.price_per_hour_online || "",
            },
          }));
        } catch (error) {
          console.error('Error fetching teacher data:', error);
          toast({
            title: t("error"),
            description: t("errorLoadingProfile"),
            variant: "destructive",
          });
        }
      };

      fetchTeacherData();
    }
  }, [userId, t, toast]);

  return { formData, setFormData, isLoading, setIsLoading, currentUserId };
};
