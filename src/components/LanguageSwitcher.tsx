import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === "fr" ? "default" : "outline"}
        onClick={() => setLanguage("fr")}
        className="w-12"
      >
        FR
      </Button>
      <Button
        variant={language === "lb" ? "default" : "outline"}
        onClick={() => setLanguage("lb")}
        className="w-12"
      >
        LB
      </Button>
    </div>
  );
};