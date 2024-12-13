import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const useTeacherProfile = (userId: string | null) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const fetchTeacherProfile = async () => {
    if (!userId) return null;

    const { data: profile, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching teacher profile:', error);
      toast({
        title: t("error"),
        description: t("errorLoadingProfile"),
        variant: "destructive",
      });
      return null;
    }

    return profile;
  };

  return { fetchTeacherProfile };
};