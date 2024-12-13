import { useState, useEffect } from "react";
import { FormData } from "./types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

export const useFormData = (userId?: string) => {
  const { t } = useLanguage();
  const { toast } = useToast();
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
  });

  // Fetch and set default city
  useEffect(() => {
    const fetchDefaultCity = async () => {
      try {
        console.log('Fetching default city...');
        // First verify if we already have a city set
        if (formData.cityId) {
          const { data: cityExists, error: verifyError } = await supabase
            .from('cities')
            .select('id')
            .eq('id', formData.cityId)
            .single();

          if (!verifyError && cityExists) {
            console.log('Current city is valid:', cityExists.id);
            return;
          }
        }

        // If no valid city is set, fetch the first available city
        const { data: cities, error } = await supabase
          .from('cities')
          .select('id')
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching default city:', error);
          toast({
            title: t("error"),
            description: t("error"),
            variant: "destructive",
          });
          return;
        }

        if (cities) {
          console.log('Setting default city:', cities.id);
          setFormData(prev => ({
            ...prev,
            cityId: cities.id
          }));
        } else {
          console.error('No cities found in the database');
          toast({
            title: t("error"),
            description: t("noResults"),
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error in fetchDefaultCity:', error);
        toast({
          title: t("error"),
          description: t("error"),
          variant: "destructive",
        });
      }
    };

    if (!userId) {
      fetchDefaultCity();
    }
  }, [userId, t, toast]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setFormData(prev => ({
          ...prev,
          email: session.user.email || ""
        }));
      }
    };

    if (!userId) {
      fetchUserEmail();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const fetchTeacherData = async () => {
        try {
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

          if (!profile) throw new Error('Profile not found');

          const pricePerHour: { [key: string]: string } = {
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
              subject: {
                id: s.subject[0].id,
                name_en: s.subject[0].name_en,
                name_fr: s.subject[0].name_fr,
                name_lb: s.subject[0].name_lb
              }
            })) || [],
            schoolLevels: schoolLevels?.map(l => l.school_level) || [],
            teachingLocations: locations?.map(l => l.location_type) || [],
            cityId: profile.city_id,
            studentRegions: studentRegions?.map(r => r.region_name) || [],
            studentCities: studentCities?.map(c => c.city_name) || [],
            pricePerHour: pricePerHour as FormData['pricePerHour'],
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
  }, [userId, t, toast]);

  return { formData, setFormData, isLoading, setIsLoading };
};