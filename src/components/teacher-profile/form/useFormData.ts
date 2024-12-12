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
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+352 123 456 789",
    facebookProfile: "https://facebook.com/johndoe",
    showEmail: true,
    showPhone: true,
    showFacebook: true,
    bio: "I am a passionate teacher with experience in multiple subjects. I enjoy helping students reach their full potential through personalized teaching methods.",
    profilePicture: null,
    profilePictureUrl: "",
    subjects: [],
    schoolLevels: ["Primary School", "Middle School"],
    teachingLocations: ["Teacher's Place", "Student's Place", "Online"],
    cityId: null, // Changed from empty string to null
    studentRegions: [],
    studentCities: [],
    pricePerHour: {
      teacherPlace: "50",
      studentPlace: "60",
      online: "45",
    },
  });

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
              subject: s.subject[0]
            })) || [],
            schoolLevels: schoolLevels?.map(l => l.school_level) || [],
            teachingLocations: locations?.map(l => l.location_type) || [],
            cityId: profile.city_id || null, // Changed from empty string to null
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