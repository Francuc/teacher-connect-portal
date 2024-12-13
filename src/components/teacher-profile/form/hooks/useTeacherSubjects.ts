import { supabase } from "@/lib/supabase";
import { TeacherSubject } from "../types";

export const useTeacherSubjects = () => {
  const fetchTeacherSubjects = async (userId: string) => {
    const { data: subjects, error } = await supabase
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
      .eq('teacher_id', userId);

    if (error) throw error;

    return subjects?.map(subjectData => ({
      subject_id: subjectData.subject_id,
      subject: {
        id: subjectData.subject.id,
        name_en: subjectData.subject.name_en,
        name_fr: subjectData.subject.name_fr,
        name_lb: subjectData.subject.name_lb
      }
    })) as TeacherSubject[];
  };

  return { fetchTeacherSubjects };
};