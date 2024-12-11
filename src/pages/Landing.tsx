import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-purple-soft/30">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            {t("landingTitle")}
          </h1>
          
          <p className="text-lg text-gray-600">
            {t("landingDescription")}
          </p>

          <Link to="/profile">
            <Button size="lg" className="gap-2">
              <BookOpen className="

I'll create a landing page similar to superprof.lu with a navigation menu for school subjects and a profile creation button. I'll use the existing theme and language support.

<lov-code>
Let's create the necessary files and update the existing ones:

1. First, let's create a navigation component:

<lov-write file_path="src/components/Navigation.tsx">
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { SUBJECTS } from "@/lib/constants";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
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

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{t("subjects")}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {SUBJECTS.map((subject) => (
                  <NavigationMenuLink
                    key={subject}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple.soft hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    asChild
                  >
                    <Link to={`/subjects/${subject.toLowerCase()}`}>
                      {subject}
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Button asChild className="bg-primary hover:bg-primary/90">
        <Link to="/profile/create">
          <UserPlus className="mr-2" />
          {t("createProfile")}
        </Link>
      </Button>
    </div>
  );
};