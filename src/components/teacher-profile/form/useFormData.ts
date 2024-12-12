import { useState, useEffect } from "react";
import { FormData } from "./types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

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
      setCurrentUserId(user?.id || userId);

      if (userId) {
        try {
          const { data: existingProfile } = await supabase
            .from('teachers')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (existingProfile) {
            setFormData(prev => ({
              ...prev,
              firstName: existingProfile.first_name,
              lastName: existingProfile.last_name,
              email: existingProfile.email,
              phone: existingProfile.phone || "",
              facebookProfile: existingProfile.facebook_profile || "",
              showEmail: existingProfile.show_email,
              showPhone: existingProfile.show_phone,
              showFacebook: existingProfile.show_facebook,
              bio: existingProfile.bio,
              cityId: existingProfile.city_id || "",
            }));

            // Fetch related data
            const [subjects, schoolLevels, locations] = await Promise.all([
              supabase.from('teacher_subjects').select('subject').eq('teacher_id', userId),
              supabase.from('teacher_school_levels').select('school_level').eq('teacher_id', userId),
              supabase.from('teacher_locations').select('*').eq('teacher_id', userId)
            ]);

            if (subjects.data) {
              setFormData(prev => ({ ...prev, subjects: subjects.data.map(s => s.subject) }));
            }
            if (schoolLevels.data) {
              setFormData(prev => ({ ...prev, schoolLevels: schoolLevels.data.map(l => l.school_level) }));
            }
            if (locations.data) {
              setFormData(prev => ({
                ...prev,
                teachingLocations: locations.data.map(l => l.location_type),
                pricePerHour: {
                  teacherPlace: locations.data.find(l => l.location_type === "Teacher's Place")?.price_per_hour.toString() || "",
                  studentPlace: locations.data.find(l => l.location_type === "Student's Place")?.price_per_hour.toString() || "",
                  online: locations.data.find(l => l.location_type === "Online")?.price_per_hour.toString() || "",
                }
              }));
            }
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          toast({
            title: t("error"),
            description: t("errorLoadingProfile"),
            variant: "destructive",
          });
        }
      }
    };

    checkAuth();
  }, [userId, t, toast]);

  return { formData, setFormData, isLoading, setIsLoading, currentUserId };
};