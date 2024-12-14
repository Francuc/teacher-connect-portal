import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BiographySection } from "@/components/teacher-profile/profile-sections/BiographySection";
import { SubjectsSection } from "@/components/teacher-profile/profile-sections/SubjectsSection";
import { SchoolLevelsSection } from "@/components/teacher-profile/profile-sections/SchoolLevelsSection";
import { LocationsSection } from "@/components/teacher-profile/profile-sections/LocationsSection";
import { PersonalSection } from "@/components/teacher-profile/profile-sections/PersonalSection";
import { Skeleton } from "@/components/ui/skeleton";

export const TeacherProfile = () => {
  const { id } = useParams();

  const { data: teacher, isLoading } = useQuery({
    queryKey: ['teacher', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          *,
          city:cities(
            *,
            region:regions(*)
          ),
          teacher_subjects(
            subject:subjects(*)
          ),
          teacher_school_levels(
            school_level
          ),
          teacher_locations(
            location_type,
            price_per_hour
          ),
          teacher_student_regions(
            region_name
          ),
          teacher_student_cities(
            cities(
              id,
              name_en,
              name_fr,
              name_lb
            )
          )
        `)
        .eq('user_id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="container py-8">
        <p>Teacher not found</p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <PersonalSection profile={teacher} />
      
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        <BiographySection bio={teacher.bio} />
        <SubjectsSection subjects={teacher.teacher_subjects} />
      </div>
      
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        <SchoolLevelsSection schoolLevels={teacher.teacher_school_levels.map(level => level.school_level)} />
        <LocationsSection 
          locations={teacher.teacher_locations}
          city={teacher.city}
          studentRegions={teacher.teacher_student_regions.map(r => r.region_name)}
          studentCities={teacher.teacher_student_cities.map(c => c.cities.name_en)}
        />
      </div>
    </div>
  );
};