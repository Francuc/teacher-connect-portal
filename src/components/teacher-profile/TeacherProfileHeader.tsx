import { Teacher } from "@/types/teacher";

interface TeacherProfileHeaderProps {
  teacher: Teacher;
}

export const TeacherProfileHeader = ({ teacher }: TeacherProfileHeaderProps) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        {teacher.profile_picture_url ? (
          <img
            src={teacher.profile_picture_url}
            alt={`${teacher.first_name} ${teacher.last_name}`}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-200" />
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold">
          {teacher.first_name} {teacher.last_name}
        </h1>
        <p className="text-gray-600">{teacher.email}</p>
      </div>
    </div>
  );
};