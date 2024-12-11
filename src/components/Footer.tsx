import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">TeacherConnect</h3>
            <p className="text-gray-600">{t("landingDescription")}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("subjects")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">
                  Mathematics
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">
                  Physics
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">
                  Languages
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("getStarted")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile/create" className="text-gray-600 hover:text-primary">
                  {t("createProfile")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} TeacherConnect. {t("allRights")}</p>
        </div>
      </div>
    </footer>
  );
};