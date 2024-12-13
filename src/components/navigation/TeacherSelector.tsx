import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const TeacherSelector = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data: teachers, error } = await supabase
        .from('teachers')
        .select('*');
      
      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }

      const profilesWithUrls = teachers.map(teacher => {
        if (teacher.profile_picture_url) {
          return {
            ...teacher,
            profile_picture_url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile-pictures/${teacher.profile_picture_url}`
          };
        }
        return teacher;
      });
      
      return profilesWithUrls || [];
    }
  });

  useEffect(() => {
    setImageErrors({});
  }, [profiles]);

  const handleProfileChange = (value: string) => {
    setSelectedProfile(value);
    if (value) {
      navigate(`/profile/${value}`);
    }
  };

  const handleImageError = (userId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [userId]: true
    }));
  };

  if (isLoading || !profiles || profiles.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <Select value={selectedProfile} onValueChange={handleProfileChange}>
        <SelectTrigger className="w-[280px] h-12 border-purple.soft/30">
          <SelectValue placeholder={t("selectProfile")} />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem 
              key={profile.user_id} 
              value={profile.user_id}
              className="flex items-center gap-2 py-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {profile.profile_picture_url && !imageErrors[profile.user_id] ? (
                    <AvatarImage 
                      src={profile.profile_picture_url} 
                      alt={`${profile.first_name} ${profile.last_name}`}
                      className="object-cover"
                      onError={() => handleImageError(profile.user_id)}
                    />
                  ) : (
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-base">{profile.first_name} {profile.last_name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedProfile && (
        <Avatar className="h-10 w-10">
          {profiles.find(p => p.user_id === selectedProfile)?.profile_picture_url && 
           !imageErrors[selectedProfile] ? (
            <AvatarImage 
              src={profiles.find(p => p.user_id === selectedProfile)?.profile_picture_url} 
              alt="Profile"
              className="object-cover"
              onError={() => handleImageError(selectedProfile)}
            />
          ) : (
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          )}
        </Avatar>
      )}
    </div>
  );
};