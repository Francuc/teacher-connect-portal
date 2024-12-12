import { useState, useEffect } from "react";
import { FormData } from "./types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeacherSubject {
  subject_id: string;
  subjects: {
    id: string;
    name_en: string;
    name_fr: string;
    name_lb: string;
  };
}

interface TeacherSubjectResponse {
  data: TeacherSubject[] | null;
  error: Error | null;
}

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
          console.log('Fetching teacher profile for userId:', userId);
          
          // Fetch teacher profile
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

            // Fetch related data in parallel
            const [
              { data: locations },
              teacherSubjectsResponse,
              { data: schoolLevels },
              { data: studentRegions },
              { data: studentCities }
            ] = await Promise.all([
              supabase
                .from('teacher_locations')
                .select('*')
                .eq('teacher_id', userId),
              supabase
                .from('teacher_subjects')
                .select(`
                  subject_id,
                  subjects (
                    id,
                    name_en,
                    name_fr,
                    name_lb
                  )
                `)
                .eq('teacher_id', userId) as Promise<TeacherSubjectResponse>,
              supabase
                .from('teacher_school_levels')
                .select('school_level')
                .eq('teacher_id', userId),
              supabase
                .from('teacher_student_regions')
                .select('region_name')
                .eq('teacher_id', userId),
              supabase
                .from('teacher_student_cities')
                .select('city_name')
                .eq('teacher_id', userId)
            ]);

            console.log('Fetched teacher subjects:', teacherSubjectsResponse.data);

            // Update form data with fetched related data
            setFormData(prev => ({
              ...prev,
              subjects: teacherSubjectsResponse.data?.map(s => s.subjects.name_en) || [],
              schoolLevels: schoolLevels?.map(l => l.school_level) || [],
              teachingLocations: locations?.map(l => l.location_type) || [],
              studentRegions: studentRegions?.map(r => r.region_name) || [],
              studentCities: studentCities?.map(c => c.city_name) || [],
              pricePerHour: {
                teacherPlace: locations?.find(l => l.location_type === "Teacher's Place")?.price_per_hour.toString() || "",
                studentPlace: locations?.find(l => l.location_type === "Student's Place")?.price_per_hour.toString() || "",
                online: locations?.find(l => l.location_type === "Online")?.price_per_hour.toString() || "",
              },
            }));
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