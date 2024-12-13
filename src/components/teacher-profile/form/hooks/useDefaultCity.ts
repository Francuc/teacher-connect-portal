import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormData } from "../types";

export const useDefaultCity = (
  formData: FormData,
  setFormData: (data: FormData) => void,
  userId?: string
) => {
  const { t } = useLanguage();
  const { toast } = useToast();

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
          return;
        }

        if (cities) {
          console.log('Setting default city:', cities.id);
          setFormData({
            ...formData,
            cityId: cities.id
          });
        }
      } catch (error) {
        console.error('Error in fetchDefaultCity:', error);
      }
    };

    if (!userId) {
      fetchDefaultCity();
    }
  }, [userId, formData.cityId, setFormData, t, toast, formData]);
};