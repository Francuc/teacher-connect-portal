import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SUBJECTS } from "@/lib/constants";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const { t } = useLanguage();

  // Type-safe translation keys for subjects
  const getSubjectTranslationKey = (subject: string) => {
    return subject.toLowerCase() as keyof typeof translations.en;
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
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {SUBJECTS.map((subject) => (
                <Link
                  key={subject}
                  to={`/?subject=${subject.toLowerCase()}`}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  {t(getSubjectTranslationKey(subject))}
                </Link>
              ))}
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