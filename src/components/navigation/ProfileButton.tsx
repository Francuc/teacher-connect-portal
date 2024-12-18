import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const ProfileButton = () => {
  const { session } = useAuth();
  const { t, language } = useLanguage();

  const { data: teacherProfile } = useQuery({
    queryKey: ['teacherProfile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (session && teacherProfile) {
    const prefix = language === 'fr' ? 'cours-de-rattrapage' : language === 'lb' ? 'nohellef' : 'tutoring';
    const teacherName = `${teacherProfile.first_name}-${teacherProfile.last_name}`.toLowerCase().replace(/\s+/g, '-');
    // Default to 'general' if no subjects are selected yet
    const url = `/${prefix}/general/${teacherName}`;

    return (
      <Link to={url}>
        <Button variant="outline" className="h-12 px-6 text-base">
          {t("myProfile")}
        </Button>
      </Link>
    );
  }

  // When not logged in, always direct to /auth
  return (
    <Link to="/auth">
      <Button variant="outline" className="h-12 px-6 text-base">
        <UserPlus className="w-5 h-5 mr-2" />
        {t("createAd")}
      </Button>
    </Link>
  );
};