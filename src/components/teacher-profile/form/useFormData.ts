import { useState, useEffect } from "react";
import { FormData } from "./types";
import { supabase } from "@/lib/supabase";
import { TeachingLocation } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useFormData = (userId: string | null) => {
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

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const loadTeacherData = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        console.log('Loading teacher data for userId:', userId);

        const [
          { data: profile },
          { data: locations },
          { data: subjects },
          { data: schoolLevels },
          { data: studentRegions },
          { data: studentCities }
        ] = await Promise.all([
          supabase
            .from('teachers')
            .select('*')
            .eq('user_id', userId)
            .single(),
          supabase
            .from('teacher_locations')
            .select('*')
            .eq('teacher_id', userId),
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
            .from('teacher_student_regions')
            .select('region_name')
            .eq('teacher_id', userId),
          supabase
            .from('teacher_student_cities')
            .select('city_name')
            .eq('teacher_id', userId)
        ]);

        if (!profile) {
          console.log('No profile found for userId:', userId);
          return;
        }

        console.log('Teacher data loaded:', {
          profile,
          locations,
          subjects,
          schoolLevels,
          studentRegions,
          studentCities
        });

        // Process locations and prices
        const locationTypes: TeachingLocation[] = [];
        const prices = {
          teacherPlace: "",
          studentPlace: "",
          online: "",
        };

        locations?.forEach(location => {
          locationTypes.push(location.location_type as TeachingLocation);
          switch (location.location_type) {
            case "Teacher's Place":
              prices.teacherPlace = location.price_per_hour.toString();
              break;
            case "Student's Place":
              prices.studentPlace = location.price_per_hour.toString();
              break;
            case "Online":
              prices.online = location.price_per_hour.toString();
              break;
          }
        });

        setFormData({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          facebookProfile: profile.facebook_profile || "",
          showEmail: profile.show_email || false,
          showPhone: profile.show_phone || false,
          showFacebook: profile.show_facebook || false,
          bio: profile.bio || "",
          profilePicture: null,
          profilePictureUrl: profile.profile_picture_url || "",
          subjects: subjects?.map(s => ({
            subject_id: s.subject_id,
            subject: {
              id: s.subject[0].id,
              name_en: s.subject[0].name_en,
              name_fr: s.subject[0].name_fr,
              name_lb: s.subject[0].name_lb
            }
          })) || [],
          schoolLevels: schoolLevels?.map(l => l.school_level) || [],
          teachingLocations: locationTypes,
          cityId: profile.city_id || "",
          studentRegions: studentRegions?.map(r => r.region_name) || [],
          studentCities: studentCities?.map(c => c.city_name) || [],
          pricePerHour: prices,
        });

      } catch (error) {
        console.error('Error loading teacher data:', error);
        toast({
          title: t("error"),
          description: t("errorLoadingProfile"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTeacherData();
  }, [userId, toast, t]);

  return {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
  };
};