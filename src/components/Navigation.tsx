import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SUBJECTS } from "@/lib/constants";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { translations } from "@/lib/i18n/translations";
import { NavLink } from "./NavLink";

export const Navigation = () => {
  const { t } = useLanguage();

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
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLinks />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/profile/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t('createProfile')}
              </Button>
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

// Separate component for navigation links
const NavLinks = () => {
  const { t } = useLanguage();
  
  // Filter out duplicate subjects and normalize them
  const uniqueSubjects = Array.from(new Set(
    SUBJECTS.map(subject => subject.toLowerCase())
  )).filter(subject => 
    subject === "mathematics" || 
    subject === "physics" || 
    subject === "chemistry" || 
    subject === "biology" || 
    subject === "english" || 
    subject === "french" || 
    subject === "history" || 
    subject === "geography" || 
    subject === "computer science" || 
    subject === "music" || 
    subject === "art"
  );

  return (
    <>
      {uniqueSubjects.map((subject) => (
        <NavLink
          key={subject}
          to={`/?subject=${subject}`}
          label={t(subject as keyof typeof translations.en)}
        />
      ))}
    </>
  );
};