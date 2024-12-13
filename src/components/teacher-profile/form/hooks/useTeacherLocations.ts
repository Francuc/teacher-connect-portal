import { supabase } from "@/lib/supabase";
import { TeachingLocation } from "@/lib/constants";

export const useTeacherLocations = () => {
  const fetchTeacherLocations = async (userId: string) => {
    const { data: locations, error } = await supabase
      .from('teacher_locations')
      .select('*')
      .eq('teacher_id', userId);

    if (error) throw error;

    return locations;
  };

  const processLocations = (locations: any[]) => {
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

    return { locationTypes, prices };
  };

  return { fetchTeacherLocations, processLocations };
};