import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { SUBJECTS } from "@/lib/constants";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const Navigation = () => {
  const { t } = useLanguage();

  const getSubjectTranslationKey = (subject: string) => {
    return subject.toLowerCase() as "mathematics" | "physics" | "languages";
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Link to="/" className="text-2xl font-bold text-primary">
          Nohëllef.lu
        </Link>

        <div className="flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t("subjects")}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {SUBJECTS.map((subject) => (
                      <NavigationMenuLink
                        key={subject}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        {t(getSubjectTranslationKey(subject))}
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <LanguageSwitcher />

          <Link to="/profile/create">
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              {t("createProfile")}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};