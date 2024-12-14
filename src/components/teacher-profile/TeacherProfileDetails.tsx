import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Teacher } from "@/types/teacher";
import { Info } from "lucide-react";

interface TeacherProfileDetailsProps {
  teacher: Teacher;
}

export const TeacherProfileDetails = ({ teacher }: TeacherProfileDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add details content here */}
        </div>
      </CardContent>
    </Card>
  );
};