import { useState, useEffect } from "react";
import { FormData } from "./types";
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
            .select('*')
            .eq('user_id', userId)
            .single();

          if (error) throw error;

          setFormData(prev => ({
            ...prev,
            firstName: teacherData.first_name,
            lastName: teacherData.last_name,
            email: teacherData.email || "",
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