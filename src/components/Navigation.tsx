import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/button";
import { LogIn, LogOut, Plus, User } from "lucide-react";
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
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Session } from "@supabase/supabase-js";

export const Navigation = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  // Reset image errors when profiles change
  useEffect(() => {
    setImageErrors({});
  }, [profiles]);

  const handleProfileAction = async () => {
    if (!session) {
      // If not logged in, redirect to auth page
      navigate("/auth");
    } else {
      // Check if user has a teacher profile
      const { data: teacherProfile } = await supabase
        .from('teachers')
        .select('user_id')
        .eq('user_id', session.user.id)
        .single();

      if (teacherProfile) {
        // If profile exists, go to edit page
        navigate(`/profile/edit/${session.user.id}`);
      } else {
        // If no profile, go to create new profile page
        navigate("/profile/new");
      }
    }
  };

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

  const handleAuthAction = async () => {
    if (session) {
      await supabase.auth.signOut();
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="border-b border-purple.soft/30 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-purple.dark hover:text-primary transition-colors">
                Nohëllef.lu
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {!isLoading && profiles && profiles.length > 0 && (
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
            )}
            <Button onClick={handleProfileAction} className="gap-2 bg-primary hover:bg-primary/90 text-white h-12 px-6 text-base rounded-md">
              <Plus className="h-5 w-5" />
              {session ? t("myProfile") : t("createAd")}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleAuthAction}
              className="h-10 w-10"
              title={session ? t("signOut") : t("signIn")}
            >
              {session ? (
                <LogOut className="h-5 w-5" />
              ) : (
                <LogIn className="h-5 w-5" />
              )}
            </Button>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};