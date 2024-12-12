import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SUBJECTS } from "@/lib/constants";

export const Navigation = () => {
  const { t } = useLanguage();

  // Type-safe translation keys for subjects
  const getSubjectTranslationKey = (subject: string): "math" | "physics" | "chemistry" | "biology" | "languages" => {
    const key = subject.toLowerCase() as "math" | "physics" | "chemistry" | "biology" | "languages";
    return key;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary">
                Nohëllef.lu
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {SUBJECTS.map((subject) => (
                <Link
                  key={subject}
                  to={`/subjects/${subject.toLowerCase()}`}
                  className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  {t(getSubjectTranslationKey(subject))}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};