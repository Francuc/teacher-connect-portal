import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { ProfileButton } from "./navigation/ProfileButton";
import { LogoutButton } from "./navigation/LogoutButton";
import { RandomTeachersButton } from "./teachers/RandomTeachersButton";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export const Navigation = () => {
  const { t } = useLanguage();
  const [session, setSession] = useState<Session | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-purple.dark hover:text-primary transition-colors">
              MengNohëllef.lu
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <RandomTeachersButton />
            <ProfileButton />
            {session && <LogoutButton />}
            <LanguageSwitcher />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
                <div className="flex flex-col gap-4 mt-8">
                  <RandomTeachersButton />
                  <ProfileButton />
                  {session && <LogoutButton />}
                  <LanguageSwitcher />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};