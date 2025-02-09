import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PersonalInfoSection } from "../PersonalInfoSection";
import { LocationSection } from "../LocationSection";
import { BiographySection } from "../BiographySection";
import { SubjectsSection } from "../SubjectsSection";
import { SchoolLevelsSection } from "../SchoolLevelsSection";
import { SubscriptionSection } from "../SubscriptionSection";
import { PasswordResetBox } from "@/components/auth/PasswordResetBox";
import { useAuth } from "@/hooks/useAuth";
import { type FormData } from "./types";

interface FormSectionsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isUpdate: boolean;
}

export const FormSections = ({ 
  formData, 
  setFormData, 
  isLoading, 
  onSubmit,
  isUpdate
}: FormSectionsProps) => {
  const { t } = useLanguage();
  const { session } = useAuth();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonalInfoSection formData={formData} setFormData={setFormData} />
        {isUpdate && session?.user && (
          <div className="space-y-6">
            <SubscriptionSection 
              profile={{
                user_id: session.user.id,
                subscription_status: formData.subscription_status,
                subscription_type: formData.subscription_type,
                subscription_end_date: formData.subscription_end_date,
                promo_code: formData.promo_code
              }} 
              isOwnProfile={true}
            />
            <PasswordResetBox />
          </div>
        )}
      </div>
      <BiographySection formData={formData} setFormData={setFormData} />
      <SubjectsSection 
        subjects={formData.subjects} 
        onSubjectsChange={(subjects) => setFormData({ ...formData, subjects })}
        isEditing={true}
      />
      <SchoolLevelsSection 
        schoolLevels={formData.schoolLevels}
        onSchoolLevelsChange={(schoolLevels) => setFormData({ ...formData, schoolLevels })}
        isEditing={true}
      />
      <LocationSection formData={formData} setFormData={setFormData} />
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUpdate ? t("update_profile") : t("save_profile")}
        </Button>
      </div>
    </form>
  );
};