import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { ProfileButton } from "./navigation/ProfileButton";
import { LogoutButton } from "./navigation/LogoutButton";
import { TeacherSelector } from "./navigation/TeacherSelector";

export const Navigation = () => {
  const { t } = useLanguage();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
            <TeacherSelector />
            <ProfileButton session={session} />
            {session && <LogoutButton />}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};