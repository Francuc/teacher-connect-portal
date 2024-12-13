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
            .eq('user_id', userId)
            .single();

          if (checkError) {
            console.log('No existing teacher profile found for userId:', userId);
            return;
          }

          // Fetch teacher profile with all related data
          const { data: profile, error: profileError } = await supabase
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
              ),
              teacher_subjects (
                subject:subjects (
                  id,
                  name_en,
                  name_fr,
                  name_lb
                )
              ),
              teacher_school_levels (
                school_level
              ),
              teacher_locations (
                location_type,
                price_per_hour
              ),
              teacher_student_regions (
                region_name
              ),
              teacher_student_cities (
                city_name
              )
            `)
            .eq('user_id', userId)
            .single();

          if (profileError) {
            console.error('Error fetching teacher profile:', profileError);
            toast({
              title: t("error"),
              description: t("errorLoadingProfile"),
              variant: "destructive",
            });
            return;
          }

          if (!profile) return;

          // Transform the data to match the form structure
          const pricePerHour = {
            teacherPlace: "",
            studentPlace: "",
            online: ""
          };

          profile.teacher_locations?.forEach((location: any) => {
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

          // Map the data to the form structure
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
            subjects: profile.teacher_subjects?.map((s: any) => ({
              subject_id: s.subject.id,
              subject: s.subject
            })) || [],
            schoolLevels: profile.teacher_school_levels?.map((l: any) => l.school_level) || [],
            teachingLocations: profile.teacher_locations?.map((l: any) => l.location_type) || [],
            cityId: profile.city_id || null,
            studentRegions: profile.teacher_student_regions?.map((r: any) => r.region_name) || [],
            studentCities: profile.teacher_student_cities?.map((c: any) => c.city_name) || [],
            pricePerHour
          });

        } catch (error) {
          console.error('Error in fetchTeacherData:', error);
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