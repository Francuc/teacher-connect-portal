import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { ProfileButton } from "./navigation/ProfileButton";
import { LogoutButton } from "./navigation/LogoutButton";
import { RandomTeachersButton } from "./teachers/RandomTeachersButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";

export const Navigation = () => {
  const { t, language } = useLanguage();
  const [session, setSession] = useState<Session | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name_en');
      
      if (error) throw error;
      return data || [];
    }
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getLocalizedName = (subject: any) => {
    if (!subject) return '';
    return language === 'fr' ? subject.name_fr : 
           language === 'lb' ? subject.name_lb : 
           subject.name_en;
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
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple.dark" />
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[200px] h-10 border-purple.soft/30">
                  <SelectValue placeholder={t("allSubjects")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allSubjects")}</SelectItem>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {getLocalizedName(subject)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <RandomTeachersButton />
            <ProfileButton session={session} />
            {session && <LogoutButton />}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};