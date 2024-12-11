import TeacherProfileForm from "@/components/TeacherProfileForm";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const PageContent = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-purple-soft/30 py-8">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            {t("personalInfo")}
          </h1>
          <LanguageSwitcher />
        </div>
        <TeacherProfileForm />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <PageContent />
    </LanguageProvider>
  );
};

export default Index;