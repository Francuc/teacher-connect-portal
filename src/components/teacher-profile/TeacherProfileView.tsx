import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { TeacherProfileHeader } from "./TeacherProfileHeader";
import { TeacherProfileDetails } from "./TeacherProfileDetails";
import { TeacherProfileSubjects } from "./TeacherProfileSubjects";
import { TeacherProfileContact } from "./TeacherProfileContact";
import { TeacherProfileReviews } from "./TeacherProfileReviews";
import { TeacherProfileAvailability } from "./TeacherProfileAvailability";
import { TeacherProfilePricing } from "./TeacherProfilePricing";
import { TeacherProfileLocation } from "./TeacherProfileLocation";
import { TeacherProfileOnline } from "./TeacherProfileOnline";
import { TeacherProfileLanguages } from "./TeacherProfileLanguages";
import { TeacherProfileEducation } from "./TeacherProfileEducation";
import { TeacherProfileExperience } from "./TeacherProfileExperience";
import { TeacherProfileCertifications } from "./TeacherProfileCertifications";
import { TeacherProfileAbout } from "./TeacherProfileAbout";
import { Skeleton } from "../ui/skeleton";

export const TeacherProfileView = ({ teacherId }: { teacherId: string }) => {
  const { t } = useLanguage();

  const { data: teacher, isLoading } = useQuery({
    queryKey: ["teacher", teacherId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teachers")
        .select("*, cities(*), subjects(*)")
        .eq("user_id", teacherId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple.soft/20 to-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple.soft/20 to-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {t("teacherNotFound")}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple.soft/20 to-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-purple.soft/30">
          <div className="p-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
            <div className="bg-white rounded-lg p-6">
              <TeacherProfileHeader teacher={teacher} />
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <TeacherProfileAbout teacher={teacher} />
                  <TeacherProfileSubjects teacher={teacher} />
                  <TeacherProfileEducation teacher={teacher} />
                  <TeacherProfileExperience teacher={teacher} />
                  <TeacherProfileCertifications teacher={teacher} />
                  <TeacherProfileReviews teacher={teacher} />
                </div>
                <div className="space-y-6">
                  <TeacherProfileContact teacher={teacher} />
                  <TeacherProfileDetails teacher={teacher} />
                  <TeacherProfilePricing teacher={teacher} />
                  <TeacherProfileAvailability teacher={teacher} />
                  <TeacherProfileLocation teacher={teacher} />
                  <TeacherProfileOnline teacher={teacher} />
                  <TeacherProfileLanguages teacher={teacher} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};