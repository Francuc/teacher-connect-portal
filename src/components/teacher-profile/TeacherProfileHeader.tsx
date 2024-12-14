import { Teacher } from "@/types/teacher";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface TeacherProfileHeaderProps {
  teacher: Teacher;
}

export const TeacherProfileHeader = ({ teacher }: TeacherProfileHeaderProps) => {
  return (
    <div className="flex items-center space-x-4 h-[105%]">
      <Avatar className="h-16 w-16">
        {teacher.profile_picture_url ? (
          <AvatarImage 
            src={teacher.profile_picture_url}
            alt={`${teacher.first_name} ${teacher.last_name}`}
          />
        ) : (
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        )}
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">
          {teacher.first_name} {teacher.last_name}
        </h1>
        {teacher.show_email && (
          <p className="text-gray-600">{teacher.email}</p>
        )}
      </div>
    </div>
  );
};