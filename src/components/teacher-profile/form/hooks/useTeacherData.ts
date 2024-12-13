import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormData } from "../types/formTypes";

export const useTeacherData = (userId: string | undefined, setFormData: (data: FormData) => void) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      const fetchTeacherData = async () => {
        try {
          // First check if the teacher profile exists
          const { data: teacherExists, error: checkError } = await supabase
            .from('teachers')
            .select('user_id')
            .eq('user_id', userId);

          if (checkError) throw checkError;

          // If no teacher profile exists, don't try to fetch data
          if (!teacherExists || teacherExists.length === 0) {
            console.log('No existing teacher profile found for userId:', userId);
            return;
          }

          const [
            { data: profile },
            { data: subjects },
            { data: schoolLevels },
            { data: locations },
            { data: studentRegions },
            { data: studentCities }
          ] = await Promise.all([
            supabase
              .from('teachers')
              .select(`
                *,
                city:cities (
                  id,
                  name_en,
                  name_fr,
                  name_lb,
                  region:regions (
                    id,
                    name_en,
                    name_fr,
                    name_lb
                  )
                )
              `)
              .eq('user_id', userId)
              .single(),
            supabase
              .from('teacher_subjects')
              .select(`
                subject_id,
                subject:subjects (
                  id,
                  name_en,
                  name_fr,
                  name_lb
                )
              `)
              .eq('teacher_id', userId),
            supabase
              .from('teacher_school_levels')
              .select('school_level')
              .eq('teacher_id', userId),
            supabase
              .from('teacher_locations')
              .select('*')
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

          if (!profile) return;

          const pricePerHour = {
            teacherPlace: "",
            studentPlace: "",
            online: ""
          };

          locations?.forEach(location => {
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
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: profile.email,
            phone: profile.phone || "",
            facebookProfile: profile.facebook_profile || "",
            showEmail: profile.show_email || false,
            showPhone: profile.show_phone || false,
            showFacebook: profile.show_facebook || false,
            bio: profile.bio,
            profilePicture: null,
            profilePictureUrl: profile.profile_picture_url || "",
            subjects: subjects?.map(s => ({
              subject_id: s.subject_id,
              subject: s.subject[0] // Access the first element of the array
            })) || [],
            schoolLevels: schoolLevels?.map(l => l.school_level) || [],
            teachingLocations: locations?.map(l => l.location_type) || [],
            cityId: profile.city_id,
            studentRegions: studentRegions?.map(r => r.region_name) || [],
            studentCities: studentCities?.map(c => c.city_name) || [],
            pricePerHour
          });
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
  }, [userId, t, toast, setFormData]);
};