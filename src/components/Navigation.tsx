import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

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
          </div>
          <div className="flex items-center gap-4">
            <Link to="/profile/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t('createAd')}
              </Button>
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};