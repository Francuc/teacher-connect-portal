import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/button";
import { Plus, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const Navigation = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProfile, setSelectedProfile] = useState<string>("");

  // Fetch all teacher profiles
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

      // Get public URLs for all profile pictures
      const profilesWithUrls = await Promise.all(teachers.map(async (teacher) => {
        if (teacher.profile_picture_url) {
          const { data } = supabase
            .storage
            .from('profile-pictures')
            .getPublicUrl(teacher.profile_picture_url);
          return { ...teacher, profile_picture_url: data.publicUrl };
        }
        return teacher;
      }));
      
      console.log('Profiles with URLs:', profilesWithUrls);
      return profilesWithUrls || [];
    }
  });

  const handleCreateAd = async () => {
    navigate("/profile/new");
  };

  const handleProfileChange = (value: string) => {
    setSelectedProfile(value);
    if (value) {
      navigate(`/profile/${value}`);
    }
  };

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold">
                Nohëllef.lu
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!isLoading && profiles && profiles.length > 0 && (
              <div className="flex items-center gap-4">
                <Select value={selectedProfile} onValueChange={handleProfileChange}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder={t("selectProfile")} />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((profile) => (
                      <SelectItem 
                        key={profile.user_id} 
                        value={profile.user_id}
                        className="flex items-center gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            {profile.profile_picture_url ? (
                              <AvatarImage 
                                src={profile.profile_picture_url} 
                                alt={`${profile.first_name} ${profile.last_name}`}
                                className="object-cover"
                              />
                            ) : (
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span>{profile.first_name} {profile.last_name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedProfile && (
                  <Avatar className="h-8 w-8">
                    {profiles.find(p => p.user_id === selectedProfile)?.profile_picture_url ? (
                      <AvatarImage 
                        src={profiles.find(p => p.user_id === selectedProfile)?.profile_picture_url} 
                        alt="Profile"
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}
              </div>
            )}
            <Button onClick={handleCreateAd} className="gap-2">
              <Plus className="h-4 w-4" />
              {t("createAd")}
            </Button>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};