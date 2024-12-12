import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-purple-soft/30">
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
              <BookOpen className="h-4 w-4" />
              {t("getStarted")}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Landing;