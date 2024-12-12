import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface TeacherProfileViewProps {
  userId: string;
}

export const TeacherProfileView = ({ userId }: TeacherProfileViewProps) => {
  const { data: teacherData } = useQuery({
    queryKey: ['teacher', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!teacherData) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Name</h3>
              <p>{teacherData.first_name} {teacherData.last_name}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};