import { useState, useEffect } from "react";
import { FormData } from "./types";
import { useTeacherProfile } from "./hooks/useTeacherProfile";
import { useTeacherSubjects } from "./hooks/useTeacherSubjects";
import { useTeacherLocations } from "./hooks/useTeacherLocations";
import { useTeacherRegions } from "./hooks/useTeacherRegions";
import { useTeacherCities } from "./hooks/useTeacherCities";
import { supabase } from "@/lib/supabase";

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
  
  const { fetchTeacherProfile } = useTeacherProfile(userId);
  const { data: allSubjects } = useTeacherSubjects();
  const { fetchTeacherLocations, processLocations } = useTeacherLocations();
  const { fetchTeacherRegions } = useTeacherRegions();
  const { fetchTeacherCities } = useTeacherCities();

  useEffect(() => {
    const loadTeacherData = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        console.log('Loading teacher data for userId:', userId);

        const [
          profile,
          locations,
          teacherSubjects,
          schoolLevels,
          studentRegions,
          studentCities
        ] = await Promise.all([
          fetchTeacherProfile(),
          fetchTeacherLocations(userId),
          supabase
            .from('teacher_subjects')
            .select('subject_id')
            .eq('teacher_id', userId),
          supabase
            .from('teacher_school_levels')
            .select('school_level')
            .eq('teacher_id', userId),
          fetchTeacherRegions(userId),
          fetchTeacherCities(userId),
        ]);

        if (!profile) {
          console.log('No profile found for userId:', userId);
          return;
        }

        const { locationTypes, prices } = processLocations(locations);

        // Map subject IDs to full subject objects
        const subjects = teacherSubjects?.data?.map(ts => {
          const subject = allSubjects?.find(s => s.id === ts.subject_id);
          return subject ? { subject } : null;
        }).filter(Boolean) || [];

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
          subjects,
          schoolLevels: schoolLevels?.data?.map(l => l.school_level) || [],
          teachingLocations: locationTypes,
          cityId: profile.city_id || "",
          studentRegions: studentRegions,
          studentCities: studentCities,
          pricePerHour: prices,
        });

      } catch (error) {
        console.error('Error loading teacher data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeacherData();
  }, [userId, allSubjects]);

  return {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
  };
};